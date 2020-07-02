from django.contrib.auth.models import UserManager, GroupManager as DjangoGroupManager


class UserTenantManager(UserManager):
    def get_queryset(self):
        from tenant.utils import get_tenant
        current_tenant = get_tenant()
        return super().get_queryset().filter(user_member__tenant=current_tenant)

    def create_tenant_admin(self, username, email=None, password=None, **extra_fields):
        from tenant.utils import get_tenant
        user = super().create_user(username, email, password, **extra_fields)
        current_tenant = get_tenant()
        if not current_tenant:
            raise Exception('Tenant must be defined')
        from auth_app.models import Member
        member = Member.objects.create(
            user=user
        )
        from auth_app.models import Group
        member.groups.add(Group.objects.get_tenant_admin())
        return user


class GroupManager(DjangoGroupManager):

    def get_tenant_admin(self):
        return self.get(pk=1)

    def get_tenant_member(self):
        return self.get(pk=2)
