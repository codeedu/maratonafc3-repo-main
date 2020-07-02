from django.urls import path, include
from rest_framework import routers

from app.api import CustomerViewSet, PaymentGatewayViewSet, CheckoutViewSet

router = routers.DefaultRouter(trailing_slash='/?')
router.register('customer', CustomerViewSet)
router.register('payment_gateway', PaymentGatewayViewSet)
router.register('checkout', CheckoutViewSet)

app_name = 'app'

urlpatterns = [
    path('api/', include(router.urls)),
]
