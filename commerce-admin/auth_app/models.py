import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, Permission as DjangoPermission, Group as DjangoGroup
from common.models import AutoCreatedUpdatedMixin
from auth_app.managers import UserTenantManager, GroupManager
from tenant.models import TenantModel
from django.utils.translation import gettext_lazy as _


class PermissionTenantQuerySet(models.QuerySet):

    def only_tenant(self):
        return self.filter(app_label='app')


class Group(DjangoGroup):

    objects = GroupManager()

    class Meta:
        proxy = True
        app_label = 'auth_app'
        verbose_name = 'grupo'


class GroupTenant(AutoCreatedUpdatedMixin, TenantModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150, unique=True, verbose_name=_('name'))
    permissions = models.ManyToManyField(DjangoPermission, related_name='group_tenants', verbose_name=_('permissions'))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'grupo personalizado'


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        verbose_name = 'usuário admin'

class UserTenant(User):
    objects = UserTenantManager()

    class Meta:
        proxy = True
        verbose_name = 'usuário'

class Member(AutoCreatedUpdatedMixin, TenantModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        UserTenant,
        on_delete=models.PROTECT,
        related_name='user_member',
    )
    groups = models.ManyToManyField(
        DjangoGroup,
        related_name='group_members',
        blank=True,
    )
    group_tenants = models.ManyToManyField(
        GroupTenant,
        related_name='group_tenant_members',
        blank=True
    )
    permissions = models.ManyToManyField(
        DjangoPermission,
        related_name='permission_members',
        blank=True
    )

    class Meta:
        verbose_name = 'membro'

    def __str__(self):
        return self.user.get_username()
