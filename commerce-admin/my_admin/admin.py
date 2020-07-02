from django.contrib import admin
from django.contrib.admin import AdminSite as DjangoAdminSite
from django.contrib.admin.options import ModelAdmin
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import redirect
from django.urls import reverse

from my_admin.models import PaymentMethod, Plan, TenantProxy, Subscription, Checkout, Customer, CustomerAddress
from tenant.models import Tenant
from tenant.utils import get_tenant


class AdminSite(DjangoAdminSite):
    site_header = "CodeCommerce"
    site_title = "CodeCommerce Admin"
    index_title = "Bem-vindo ao CodeCommerce Admin"
    login_form = AuthenticationForm

    def login(self, request, extra_context=None):
        tenant = get_tenant()
        if tenant and tenant.is_admin is False:
            return redirect(reverse('admin_tenant:login'))
        return super().login(request, extra_context)


admin_site = AdminSite(name='admin_site')

@admin.register(TenantProxy, site=admin_site)
class TenantAdmin(ModelAdmin):
    list_display = ('company', 'site')

@admin.register(PaymentMethod, site=admin_site)
class PaymentMethodAdmin(ModelAdmin):
    list_display = ('name', 'allow_installments')

@admin.register(Plan, site=admin_site)
class PlanAdmin(ModelAdmin):
    list_display = ('name', )

class CustomerAddressInline(admin.StackedInline):
    model = CustomerAddress
    extra = 1

@admin.register(Customer, site=admin_site)
class CustomerAdmin(ModelAdmin):
    list_display = ('name', 'email')
    inlines = (CustomerAddressInline,)

@admin.register(Subscription, site=admin_site)
class SubscriptionAdmin(ModelAdmin):
    list_display = ('get_customer', )

    def get_customer(self, obj):
        return obj.checkout.customer_address.customer.name

    get_customer.short_description = 'Cliente'

class SubscriptionInline(admin.StackedInline):
    model = Subscription

@admin.register(Checkout, site=admin_site)
class CheckoutAdmin(ModelAdmin):
    model = Checkout
    inlines = (SubscriptionInline,)
