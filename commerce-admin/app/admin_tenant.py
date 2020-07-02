from django.contrib.admin import ModelAdmin
from django.contrib import admin
from polymorphic.admin import PolymorphicParentModelAdmin, PolymorphicChildModelFilter, PolymorphicChildModelAdmin

from app.forms import ProductPaymentMethodForm
from app.models import Category, Product, ProductPaymentMethod, PaymentMethodConfig, PaymentGateway, PagarmeGateway, \
    CustomerAddress, Customer, Checkout, CheckoutItem
from tenant.admin_tenant import AdminTenantModelAdmin, admin_tenant_site


@admin.register(Category, site=admin_tenant_site)
class CategoryAdmin(ModelAdmin, AdminTenantModelAdmin):
    search_fields = ('name',)

class ProductPaymentMethodInline(admin.TabularInline):
    model = ProductPaymentMethod
    extra = 1
    form = ProductPaymentMethodForm


@admin.register(Product, site=admin_tenant_site)
class ProductAdmin(ModelAdmin, AdminTenantModelAdmin):
    search_fields = ('name',)
    inlines = (ProductPaymentMethodInline,)

@admin.register(PaymentMethodConfig, site=admin_tenant_site)
class PaymentMethodConfig(ModelAdmin, AdminTenantModelAdmin):
    pass

@admin.register(PaymentGateway, site=admin_tenant_site)
class PaymentGatewayAdmin(PolymorphicParentModelAdmin):
    exclude = ['tenant']
    base_model = PaymentGateway
    child_models = (PagarmeGateway,)
    list_filter = (PolymorphicChildModelFilter,)  # This is optional.

@admin.register(PagarmeGateway, site=admin_tenant_site)
class PagarmeGatewayAdmin(PolymorphicChildModelAdmin):
    exclude = ['tenant']
    base_model = PaymentGateway
    show_in_index = True

class CustomerAddressInline(admin.StackedInline):
    model = CustomerAddress
    extra = 1

@admin.register(Customer, site=admin_tenant_site)
class CustomerAdmin(ModelAdmin):
    list_display = ('name', 'email')
    inlines = (CustomerAddressInline,)

class CheckoutInline(admin.TabularInline):
    model = CheckoutItem

@admin.register(Checkout, site=admin_tenant_site)
class CheckoutAdmin(ModelAdmin):
    list_display = ('get_customer','status', 'get_payment_method', 'get_total')
    inlines = (CheckoutInline, )

    def get_customer(self, obj):
        return obj.customer_address.customer.name

    get_customer.short_description = 'cliente'

    def get_payment_method(self, obj):
        return obj.payment_method.get_name_display()

    get_payment_method.short_description = 'método de pagamento'

    def get_total(self, obj):
        return obj.total

    get_total.short_description = 'total'