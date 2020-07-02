from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class AuthAppConfig(AppConfig):
    name = 'auth_app'
    verbose_name = _("Authentication and Authorization")
