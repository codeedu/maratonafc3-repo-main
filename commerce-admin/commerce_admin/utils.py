from django.core.cache import cache

class AllowedHosts(object):

    def __init__(self, defaults=None, cache=True):
        self.defaults = defaults or ()
        self.cache = cache

    def get_sites(self):
        sites = cache.get('sites', None)
        if self.cache is True and sites is not None:
            return sites + self.defaults

        from tenant.models import Tenant
        tenants = Tenant.objects.all()
        sites = tuple('.' + tenant.site for tenant in tenants)
        cache.set('sites,', sites)

        return sites + self.defaults

    def clear(self):
        cache.delete('sites')

    def __iter__(self):
        return iter(self.get_sites())

    def __str__(self):
        return ', '.join(self.get_sites())

    def __contains__(self, other):
        return other in self.get_sites()

    def __len__(self):
        return len(self.get_sites())

    def __add__(self, other):
        return self.__class__(defaults=self.defaults + other.defaults)
