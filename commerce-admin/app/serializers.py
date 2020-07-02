from django.conf import settings
from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from app.models import Category, Product, ProductPaymentMethod, Customer, CustomerAddress, PagarmeGateway, Checkout, \
    CheckoutItem, PaymentMethodConfig
from my_admin.models import PaymentMethod


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    image = serializers.ImageField(write_only=True)
    image_url = serializers.SerializerMethodField(read_only=True)

    def get_image_url(self, obj):
        return obj.image.url


class PaymentMethodConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethodConfig
        fields = '__all__'


class ProductPaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPaymentMethod
        fields = '__all__'


class CustomerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAddress
        fields = '__all__'
        read_only_fields = ('customer',)


class CustomerSerializer(serializers.ModelSerializer):
    address = CustomerAddressSerializer(required=True)
    email = serializers.EmailField()

    def create(self, validated_data: dict):
        address = validated_data.pop('address')
        customer = super().create(validated_data)
        customer_address = CustomerAddress.objects.create(**dict(address), customer=customer)
        customer.address = customer_address
        return customer

    class Meta:
        model = Customer
        fields = '__all__'

class PagarmeGatewaySerializer(serializers.ModelSerializer):
    class Meta:
        model = PagarmeGateway
        fields = ('id', 'encryption_key', )

class PaymentGatewaySerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        PagarmeGateway: PagarmeGatewaySerializer,
    }

class CheckoutItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckoutItem
        fields = ('product', 'price', 'quantity')
        read_only_fields = ('checkout','price', 'bank_slip_url')

class CheckoutSerializer(serializers.ModelSerializer):
    payment_method = serializers.SlugRelatedField(
        slug_field='name',
        queryset=PaymentMethod.objects.all(),
    )
    status = serializers.IntegerField(read_only=True)
    items = CheckoutItemSerializer(many=True)

    def create(self, validated_data: dict):
        items = list(validated_data.pop('items'))
        checkout = Checkout.objects.create(**validated_data)
        checkout_items = []
        for item in items:
            new_item = dict(item)
            new_item['price'] = new_item['product'].sale_price
            new_item['checkout'] = checkout
            checkout_items.append(CheckoutItem(**new_item))

        checkout.items = checkout.checkout_items.bulk_create(checkout_items)
        return checkout

    class Meta:
        model = Checkout
        fields = '__all__'
