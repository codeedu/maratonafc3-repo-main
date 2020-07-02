from django.utils.module_loading import autodiscover_modules


def autodiscover():
    autodiscover_modules('admin_tenant')


default_app_config = 'tenant.apps.TenantConfig'
