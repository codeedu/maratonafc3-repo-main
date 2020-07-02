import uuid
from enum import Enum
from django.db import models
from common.models import AutoCreatedUpdatedMixin, BaseCustomer, BaseAddress

# Create your models here.
from tenant.models import Tenant, TenantModel

class TenantProxy(Tenant):
    class Meta:
        verbose_name = 'loja'
        proxy=True

class PaymentMethodEnum(Enum):
    CREDIT_CARD = 'credit_card'
    BANK_SLIP = 'bank_slip'


payment_method_choices = [(pm.value, pm.name,) for pm in PaymentMethodEnum]


class PaymentMethod(AutoCreatedUpdatedMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    PAYMENT_METHOD_CHOICES = (
        ("credit_card", "Cartão de crédito"),
        ("bank_slip", "Boleto"),
    )
    name = models.CharField(max_length=255, choices=PAYMENT_METHOD_CHOICES, verbose_name='nome')
    allow_installments = models.BooleanField(default=True, verbose_name='com parcelamento')

    class Meta:
        verbose_name = 'método de pagamento'

    def __str__(self):
        return self.get_name_display()


class Plan(AutoCreatedUpdatedMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='nome')
    CYCLE_CHOICES = (
        ('6', 'Semestral'),
        ('12', 'Anual'),
        ('24', 'Bi-Anual'),
    )
    billing_cycle = models.CharField(max_length=20, choices=CYCLE_CHOICES, verbose_name='ciclo')
    price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="preço")
    remote_plan_id = models.CharField(
        max_length=255,
        verbose_name='id do plano remoto',
        help_text='Id do plano no gateway de pagamento'
    )

    class Meta:
        verbose_name = 'plano'

    def __str__(self):
        return self.name

class Customer(BaseCustomer):
    class Meta:
        verbose_name = 'cliente'

class CustomerAddress(BaseAddress):
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)

    class Meta:
        verbose_name = 'endereço'

    def __str__(self):
        return "%s | %s" % (self.customer.name, self.street)

class Checkout(AutoCreatedUpdatedMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="preço")
    customer_address = models.ForeignKey(CustomerAddress, on_delete=models.PROTECT, verbose_name='Cliente')
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT, verbose_name='plano')
    remote_plan_id = models.CharField(
        max_length=255,
        verbose_name='id remoto do plano',
        help_text='id remoto do plano no gateway de pagamento'
    )
    status = models.PositiveSmallIntegerField(default=1)

    class Meta:
        verbose_name = 'fatura'

class Subscription(AutoCreatedUpdatedMixin, TenantModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    start_date = models.DateField(verbose_name='início')
    expires_date = models.DateField(verbose_name='fim')
    remote_subscription_id = models.CharField(
        max_length=255,
        verbose_name='id remoto da assinatura',
        help_text='id da assinatura no gateway de pagamento'
    )
    checkout = models.OneToOneField(Checkout, on_delete=models.PROTECT)
