from common.sync_models import PublisherModelObserver
from tenant.models import Tenant
from tenant.serializers import TenantSerializer

tenant_observer = PublisherModelObserver(Tenant, TenantSerializer)
tenant_observer.register()