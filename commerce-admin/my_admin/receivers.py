from my_admin.models import PaymentMethod
from common.sync_models import PublisherModelObserver
from my_admin.serializers import PaymentMethodSerializer

payment_method_observer = PublisherModelObserver(PaymentMethod, PaymentMethodSerializer)
payment_method_observer.register()
