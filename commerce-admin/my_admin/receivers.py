from my_admin.models import PaymentMethod
from common.sync_models import PublisherModelObserver
from my_admin.serializers import PaymentMethodSerializer
from my_admin.models import TenantProxy
from tenant.serializers import TenantSerializer


payment_method_observer = PublisherModelObserver(PaymentMethod, PaymentMethodSerializer)
payment_method_observer.register()

tenant_observer = PublisherModelObserver(TenantProxy, TenantSerializer)
tenant_observer.register()