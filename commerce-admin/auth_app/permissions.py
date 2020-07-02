from enum import Enum

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType


class DefaultPermission(Enum):
    ADMIN = 'Administrador'
    MEMBER = 'Membro'

    @staticmethod
    def get_permission():
        return {
            DefaultPermission.ADMIN.value: [
                'auth_app.usertenant',
                'auth_app.grouptenant',
                'auth_app.member',
                'app.category',
                'app.product',
                'app.productpaymentmethod',
                'app.paymentmethodconfig',
                'app.paymentgateway',
                'app.pagarmegateway',
                'app.customer',
                'app.customeraddress',
                'app.checkout',
                'app.checkoutitem',
                {
                    'my_admin.paymentmethod': [
                        'view_paymentmethod'
                    ]
                }
            ],
            DefaultPermission.MEMBER.value: [

            ]
        }

    @staticmethod
    def convert_in_codename_permissions():
        permissions = {}
        for group_shared, permission_map in DefaultPermission.get_permission().items():
            permissions[group_shared] = []
            if type(permission_map) is dict:
                for model, perms in permission_map.items():
                    permissions[group_shared].extend(
                        DefaultPermission.__get_permissions_from_model(model, perms).values_list('codename', flat=True))
            else:
                for model in permission_map:
                    if type(model) is not dict:
                        permissions[group_shared].extend(
                            DefaultPermission.__get_permissions_from_model(model).values_list('codename', flat=True))
                    else:
                        for m, perms in model.items():
                            permissions[group_shared].extend(
                                DefaultPermission.__get_permissions_from_model(m, perms).values_list('codename',
                                                                                                     flat=True))
        return permissions

    @staticmethod
    def unique_permissions():
        group_permissions = DefaultPermission.convert_in_codename_permissions()
        permissions = []
        for group, perm in group_permissions.items():
            permissions.extend(perm)
        return list(set(permissions))

    @staticmethod
    def __get_permissions_from_model(model: str, permissions=None):
        app_label, model_ = model.split('.')
        content_type = ContentType.objects.get(app_label=app_label, model=model_)
        queryset = Permission.objects.filter(content_type=content_type)
        if permissions:
            queryset = queryset.filter(codename__in=permissions)
        result = queryset
        if not result.count():
            raise Exception('Model or Permissions %s to model %s not exist' % (str(permissions), model))
        return result
