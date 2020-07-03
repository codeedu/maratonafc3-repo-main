from django.db import models
from tenant.utils import get_tenant, get_tenant_filters
from polymorphic.managers import PolymorphicManager

class TenantManager(models.Manager):
    def get_queryset(self):
        queryset = self._queryset_class(self.model)
        current_tenant = get_tenant()
        if current_tenant:
            kwargs = get_tenant_filters()
            return queryset.filter(**kwargs)
        return queryset

class TenantPolymorphicManager(PolymorphicManager):
    def get_queryset(self):
        queryset = super().get_queryset()
        current_tenant = get_tenant()
        if current_tenant:
            kwargs = get_tenant_filters()
            return queryset.filter(**kwargs)
        return queryset