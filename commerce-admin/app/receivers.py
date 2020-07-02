from app.models import Category, Product, ProductPaymentMethod, PaymentMethodConfig
from app.serializers import CategorySerializer, ProductSerializer, \
    ProductPaymentMethodSerializer, PaymentMethodConfigSerializer
from common.sync_models import PublisherModelObserver

category_observer = PublisherModelObserver(Category, CategorySerializer)
category_observer.register()

product_observer = PublisherModelObserver(Product, ProductSerializer)
product_observer.register()

#product_payment_method_observer = PublisherModelObserver(ProductPaymentMethod, ProductPaymentMethodSerializer)
#product_payment_method_observer.register()


payment_method_config_observer = PublisherModelObserver(PaymentMethodConfig, PaymentMethodConfigSerializer)
payment_method_config_observer.register()

