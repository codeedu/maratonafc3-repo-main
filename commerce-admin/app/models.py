import uuid

from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from my_admin.models import PaymentMethod
from common.models import AutoCreatedUpdatedMixin, BaseCustomer, BaseAddress
from tenant.models import TenantModel, TenantPolymorphicModel
import os
from polymorphic.models import PolymorphicModel


class Category(AutoCreatedUpdatedMixin, TenantModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='nome')
    slug = models.SlugField()

    class Meta:
        verbose_name = 'categoria'

    def __str__(self):
        return self.name


def hash_filename_to_uuid(instance, filename):
    fname, ext = os.path.splitext(filename)
    new_filename = "{0}{1}".format(uuid.uuid4(), ext)
    return new_filename


def upload_to(instance, filename):
    new_filename = hash_filename_to_uuid(instance, filename)
    return os.path.join(settings.MEDIA_BASE_PATH + '/products/', new_filename)


class Product(AutoCreatedUpdatedMixin, TenantModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='nome')
    description = models.TextField()
    slug = models.SlugField()
    sale_price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name='preço de venda')
    purchase_price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name='preço de compra')
    featured = models.BooleanField(default=False, verbose_name='destaque')
    image = models.ImageField(
        max_length=255,
        upload_to=upload_to
    )
    category = models.ForeignKey(Category, on_delete=models.PROTECT, verbose_name='categorias')

    class Meta:
        verbose_name = 'produto'

    def __str__(self):
        return self.name


class ProductPaymentMethod(AutoCreatedUpdatedMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.PROTECT, verbose_name='produto')
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT, verbose_name='método de pagamento')
    max_installments = models.SmallIntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(1)],
        verbose_name='número de parcelas máximo'
    )
    max_installments_discount = models.SmallIntegerField(
        blank=True,
        null=True,
        verbose_name='desconto em parcela',
        help_text='Máximo de parcelas com desconto'
    )
    discount_percentage = models.PositiveSmallIntegerField(
        blank=True,
        null=True,
        validators=[MaxValueValidator(100)],
        verbose_name='desconto',
        help_text='Desconto em %'
    )

    class Meta:
        verbose_name = 'métodos de pagamento'
        unique_together = ('product_id', 'payment_method_id',)


class PaymentGateway(AutoCreatedUpdatedMixin, TenantPolymorphicModel, PolymorphicModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='nome')
    default = models.BooleanField(default=False, verbose_name='principal')

    class Meta:
        verbose_name = 'gateway de pagamento'

    def __str__(self):
        return self.name


class PagarmeGateway(PaymentGateway):
    api_key = models.CharField(max_length=255)
    encryption_key = models.CharField(max_length=255)

    class Meta:
        verbose_name = 'Pagar.me'
        verbose_name_plural = 'Pagar.me'


class PaymentMethodConfig(AutoCreatedUpdatedMixin, TenantModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT, verbose_name='método de pagamento')
    max_installments = models.SmallIntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
        verbose_name='parcelamento',
        help_text='Se não permitir parcelamento, deixe como 0'
    )
    discount_percentage = models.PositiveSmallIntegerField(
        blank=True,
        null=True,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100)
        ],
        verbose_name='desconto',
        help_text='Desconto em % (se não tiver, deixe como 0)'
    )

    class Meta:
        verbose_name = 'configuração de métodos de pagamento'
        unique_together = ('payment_method_id', 'tenant_id',)

    def __str__(self):
        return self.payment_method.get_name_display()


class Customer(BaseCustomer, TenantModel):
    class Meta:
        verbose_name = 'cliente'


class CustomerAddress(BaseAddress, TenantModel):
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)

    class Meta:
        verbose_name = 'endereço'

    def __str__(self):
        return "%s | %s" % (self.customer.name, self.street)


class Checkout(AutoCreatedUpdatedMixin, TenantModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer_address = models.ForeignKey(CustomerAddress, on_delete=models.PROTECT, verbose_name='cliente')
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT, verbose_name='método de pagamento')
    installments = models.SmallIntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(1)],
        verbose_name='número de parcelas'
    )
    bank_slip_url = models.URLField(null=True, verbose_name='url do boleto')
    status = models.PositiveSmallIntegerField(default=1)
    remote_id = models.CharField(
        max_length=255,
        null=True,
        default=None,
        verbose_name='id remoto da fatura',
        help_text='id remoto da fatura no gateway de pagamento'
    )

    @property
    def total(self):
        sum = 0
        for item in self.checkout_items.all():
            sum += item.price * item.quantity
        return sum

    class Meta:
        verbose_name = 'venda'


class CheckoutItem(AutoCreatedUpdatedMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    checkout = models.ForeignKey(Checkout, on_delete=models.PROTECT, related_name='checkout_items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT, verbose_name='produto')
    quantity = models.PositiveSmallIntegerField(verbose_name='quantidade')
    price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name='preço')

    class Meta:
        verbose_name = 'item'
        verbose_name_plural = 'itens'
