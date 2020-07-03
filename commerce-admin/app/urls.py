from django.urls import path, include
from rest_framework import routers

from app.api import CustomerViewSet, PaymentGatewayViewSet, CheckoutViewSet

router = routers.DefaultRouter(trailing_slash='/?')
router.register('customer', CustomerViewSet, basename='customer')
router.register('payment_gateway', PaymentGatewayViewSet, basename='payment_gateway')
router.register('checkout', CheckoutViewSet, basename='checkout')

app_name = 'app'

urlpatterns = [
    path('api/', include(router.urls)),
]
