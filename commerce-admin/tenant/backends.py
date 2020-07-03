from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import Permission
from django.db.models import Q

from auth_app.models import User, Member
from tenant.utils import get_tenant


class TenantBackend(ModelBackend):

    def user_can_authenticate(self, user: User):
        can_authenticate = super().user_can_authenticate(user)
        member = getattr(user, 'user_member', None)
        tenant = get_tenant()

        tenant_has_member = member.tenant.id == tenant.id if member and tenant else False
        return True if can_authenticate and member and tenant_has_member else False

    def get_all_permissions(self, user_obj, obj=None):
        if not user_obj.is_active or user_obj.is_anonymous or obj is not None:
            return set()
        if not hasattr(user_obj, '_perm_tenant_cache'):
            user_obj._perm_cache = {
                *self.get_user_permissions(user_obj),
                *self.get_group_permissions(user_obj),
            }
        return user_obj._perm_cache

    def _get_permissions(self, user_obj, obj, from_name):
        """
        Return the permissions of `user_obj` from `from_name`. `from_name` can
        be either "group" or "user" to return permissions from
        `_get_group_permissions` or `_get_user_permissions` respectively.
        """
        if not user_obj.is_active or user_obj.is_anonymous or obj is not None:
            return set()

        perm_cache_name = '_%s_perm_tenant_cache' % from_name
        if not hasattr(user_obj, perm_cache_name):
            if user_obj.is_superuser:
                perms = Permission.objects.all()
            else:
                perms = getattr(self, '_get_%s_permissions' % from_name)(user_obj)
            perms = perms.values_list('content_type__app_label', 'codename').order_by() if perms else []
            setattr(user_obj, perm_cache_name, {"%s.%s" % (ct, name) for ct, name in perms})
        return getattr(user_obj, perm_cache_name)

    def _get_user_permissions(self, user_obj):
        tenant = get_tenant()
        return None if not tenant else self.__get_member(user_obj).permissions.all()

    def __get_member(self, user_obj) -> Member:
        tenant = get_tenant()
        return Member.objects.get(user=user_obj, tenant=tenant)

    def _get_group_permissions(self, user_obj):
        tenant = get_tenant()
        if not tenant:
            return set()
        else:
            return Permission.objects.filter(
                Q(
                    group_tenants__tenant=tenant,
                    group_tenants__group_tenant_members__user=user_obj,
                ) |
                Q(
                    group__group_members__tenant=tenant,
                    group__group_members__user=user_obj,
                )
            )
