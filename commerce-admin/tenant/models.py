import uuid
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from common.models import AutoCreatedUpdatedMixin
from common.validators import simple_domain_name_validator
from tenant.managers import TenantManager, TenantPolymorphicManager
from tenant.utils import get_tenant

class Tenant(AutoCreatedUpdatedMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.CharField(max_length=255, verbose_name='empresa')
    is_admin = models.BooleanField(default=False, verbose_name='administrador')
    site = models.CharField(
        'site',
        max_length=100,
        validators=[simple_domain_name_validator],
        unique=True,
    )
    fallback_subdomain = models.CharField(
        'subdomínio',
        max_length=100,
        validators=[simple_domain_name_validator],
        unique=True,
        help_text='Este subdomínio serve para o cliente acessar quando não registrou o domínio principal'
    )

    def __str__(self):

        return "%s | %s" % (self.company, self.site)

def assign_tenant(sender, instance, **kwargs):
    if not getattr(instance, settings.TENANT_FIELD):
        tenant = get_tenant()
        if tenant:
            setattr(instance, settings.TENANT_FIELD, tenant.id)

class BaseTenantModel(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        null=True,
        editable=False,
        on_delete=models.PROTECT,
        related_name='%(class)s_tenants',
        verbose_name=_('tenant')
    )

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        models.signals.pre_save.connect(assign_tenant, sender=cls)

    class Meta:
        abstract = True

class TenantModel(BaseTenantModel):
    objects = TenantManager()

    class Meta:
        abstract = True

#meios de pagamentos
class TenantPolymorphicModel(BaseTenantModel):
    objects = TenantPolymorphicManager()

    class Meta:
        abstract = True