from django.contrib.sites.models import _simple_domain_name_validator, Site
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def handle(self, **options):
        domain = input('Type the default site: ')
        _simple_domain_name_validator(domain)
        try:
            Site.objects.get_by_natural_key(domain)
            print('The domain must be unique')
        except Site.DoesNotExist:
            site = Site.objects.first()
            site.domain = domain
            site.save()
            print('The default saved')

    handle.short_description = u"Set the default site"
