from django import forms

from app.models import ProductPaymentMethod


class ProductPaymentMethodForm(forms.ModelForm):

    def clean(self):
        self.validate_max_installments()
        self.validate_max_installments_discount()
        return self.cleaned_data

    def validate_max_installments(self):
        payment_method = self.cleaned_data.get('payment_method')
        max_installments = self.cleaned_data.get('max_installments')
        if payment_method and max_installments and not payment_method.allow_installments:
            self.add_error('max_installments', 'Este método de pgamento não suporta parcelamento')

    def validate_max_installments_discount(self):
        max_installments = self.cleaned_data.get('max_installments')
        max_installments_discount = self.cleaned_data.get('max_installments_discount')
        if max_installments \
                and max_installments_discount \
                and max_installments_discount > max_installments:
            self.add_error('max_installments_discount', 'O desconto em parcela não pode ser maior que o parcelamento')

    class Meta:
        model = ProductPaymentMethod
        fields = '__all__'