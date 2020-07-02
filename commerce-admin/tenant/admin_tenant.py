from django.contrib.admin import AdminSite
from django.contrib.admin.options import BaseModelAdmin
from django.contrib.auth.forms import AuthenticationForm


class AdminTenantModelAdmin(BaseModelAdmin):
    def get_fields(self, request, obj=None):
        fields = super().get_fields(request, obj)
        if 'tenant' in fields:
            fields.remove('tenant')
        return fields


class AdminTenantSite(AdminSite):
    site_header = "CodeCommerce"
    site_title = "CodeCommerce Tenant"
    index_title = "Bem-vindo ao CodeCommerce Tenant"
    login_form = AuthenticationForm

    def has_permission(self, request):
        return request.user.is_active


admin_tenant_site = AdminTenantSite(name='admin_tenant')
