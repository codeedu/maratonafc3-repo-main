from django.db.models.query_utils import Q
from django.http import HttpRequest
from django.utils.deprecation import MiddlewareMixin

from tenant.models import Tenant
from tenant.utils import set_tenant
import tldextract


class TenantMiddleware(MiddlewareMixin):

    def process_request(self, request: HttpRequest):
        try:
            self._load_tenant(self._get_domain(request.get_host()))
        except:
            try:
                subdomain = request.get_host().split('.')[0].replace('-admin', '')
                self._load_tenant(subdomain)
            except:
                pass

    @staticmethod
    def _get_domain(hostname):
        extract = tldextract.extract(hostname)
        subdomain_list = extract.subdomain.split('.')
        subdomain = subdomain_list[len(subdomain_list) - 1] if len(subdomain_list) > 1 else ""
        subdomain = subdomain + "." if subdomain != "" else ""
        suffix = "." + extract.suffix if extract.suffix != "" else ""
        return "%s%s%s" % (subdomain, extract.domain, suffix)

    def _load_tenant(self, domain):
        tenant = Tenant.objects.get(
            Q(site=domain) |
            Q(fallback_subdomain=domain)
        )
        set_tenant(tenant)
