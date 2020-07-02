from django.conf import settings
from threading import local

_thread_local = local()


def get_tenant_filters():
    filters = {}

    tenant_id = get_tenant().id if get_tenant() else None

    if not tenant_id:
        return filters

    filters[settings.TENANT_FIELD] = tenant_id

    return filters


def set_tenant(current_tenant):
    from tenant.models import Tenant

    tenant = current_tenant \
        if isinstance(current_tenant, Tenant) \
        else Tenant.objects.get(site__domain=current_tenant)

    setattr(_thread_local, 'tenant', tenant)


def get_tenant():
    return getattr(_thread_local, 'tenant', None)
