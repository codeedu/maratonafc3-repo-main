from django.contrib.admin import StackedInline, ModelAdmin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.models import Permission

from auth_app.models import Member, UserTenant, GroupTenant
from auth_app.permissions import DefaultPermission
from tenant.admin_tenant import admin_tenant_site, AdminTenantModelAdmin
from django.utils.translation import gettext_lazy as _

class UserCommonAdmin(DjangoUserAdmin):
    exclude = ('last_login', 'groups', 'is_superuser', 'user_permissions', 'role', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Permissions'), {
            'fields': ('is_active',),
        }),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ['username', 'password1', 'password2'],
        }),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
    )
    list_filter = ('is_active', 'groups')
    list_display = ('username', 'email', 'first_name', 'last_name')
    search_fields = (
        'name',
        'email',
        'first_name',
        'last_name',
    )

class MemberStackedAdmin(StackedInline, AdminTenantModelAdmin):
    model = Member
    max_num = 1
    min_num = 1
    verbose_name = _('Member')
    verbose_name_plural = _('Members')
    can_delete = False

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        formset.validate_min = True

        form = formset.form
        allowed_permissions = self.__get_allowed_permissions()
        permissions = Permission.objects.filter(codename__in=allowed_permissions)
        form.base_fields['permissions'].queryset = permissions
        return formset

    def __get_allowed_permissions(self):
        permissions = DefaultPermission.unique_permissions()
        return permissions

@admin.register(UserTenant, site=admin_tenant_site)
class UserTenantAdmin(UserCommonAdmin):
    inlines = [MemberStackedAdmin, ]

@admin.register(GroupTenant, site=admin_tenant_site)
class GroupTenantAdmin(ModelAdmin, AdminTenantModelAdmin):
    pass