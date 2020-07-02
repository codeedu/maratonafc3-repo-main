from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from my_admin.admin import admin_site
from auth_app.models import User, Group


class UserAdmin(DjangoUserAdmin):
    pass


admin_site.register(Group)
admin_site.register(User, UserAdmin)
