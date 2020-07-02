from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand
from django.db import transaction

from auth_app.permissions import DefaultPermission


class Command(BaseCommand):

    def handle(self, **options):
        group_permissions = DefaultPermission.convert_in_codename_permissions()
        with transaction.atomic():
            for group_shared, permissions in group_permissions.items():
                group = Group.objects.get(name=group_shared)
                permissions_add = group.permissions.filter(codename__in=permissions).values_list('codename', flat=True)
                permissions_not_add = list(set(permissions) - set(permissions_add))
                if not len(permissions_not_add):
                    continue
                permissions_not_add = Permission.objects.filter(codename__in=permissions_not_add).values_list('id',
                                                                                                              flat=True)
                group.permissions.add(*permissions_not_add)

    handle.short_description = u"Sync permissions with tenant groups"
