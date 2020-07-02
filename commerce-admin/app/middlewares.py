from django.http import HttpRequest
from django.utils.deprecation import MiddlewareMixin

from app.models import PaymentMethodConfig, PaymentGateway
from tenant.utils import get_tenant
from django.contrib import messages

class CheckPaymentMethodConfigMiddleware(MiddlewareMixin):

    def process_request(self, request: HttpRequest):
        tenant = get_tenant()
        if tenant and not PaymentMethodConfig.objects.count():
            add_once_message(request, messages.WARNING, 'Defina a configuração de métodos de pagamento.')

class CheckPaymentGatewayDefaultMiddleware(MiddlewareMixin):

    def process_request(self, request: HttpRequest):
        tenant = get_tenant()
        if tenant and not PaymentGateway.objects.count():
            add_once_message(request, messages.WARNING, 'Defina um gateway de pagamento padrão')

def add_once_message(request, level, msg):
    if msg not in [m.message for m in messages.get_messages(request)]:
        messages.add_message(request,level, msg)
