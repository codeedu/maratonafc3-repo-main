from django.apps import AppConfig
from django.contrib.admin.apps import AdminConfig


class MyAdminConfig(AdminConfig):
    name = 'my_admin'
    default_site = 'admin.admin.AdminSite'

    def ready(self):
        import my_admin.receivers
        super().ready()

