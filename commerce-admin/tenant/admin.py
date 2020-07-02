from django.contrib import admin

# Register your models here.
from my_admin.admin import admin_site
from tenant.models import Tenant

#admin_site.register(Tenant)