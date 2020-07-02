import uuid

from django.db import models


class AutoCreatedUpdatedMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class BaseCustomer(AutoCreatedUpdatedMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='nome')
    email = models.CharField(max_length=255, verbose_name='e-mail')
    personal_document = models.CharField(max_length=20, verbose_name='cpf')

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class BaseAddress(AutoCreatedUpdatedMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    zip_code = models.CharField(max_length=15, verbose_name='cep')
    street = models.CharField(max_length=255, verbose_name='endereço')
    street_number = models.CharField(max_length=10, verbose_name='número')
    street_2 = models.CharField(max_length=255, null=True, verbose_name='complemento')
    neighborhood = models.CharField(max_length=255, verbose_name='bairro')
    city = models.CharField(max_length=255, verbose_name='cidade')
    state = models.CharField(max_length=255, verbose_name='estado')
    ddd1 = models.CharField(max_length=2, verbose_name='ddd')
    phone1 = models.CharField(max_length=255, verbose_name='telefone')

    class Meta:
        abstract = True

    def __str__(self):
        return "%s%s%s" % (self.street, self.city, self.neighborhood)