import {Injectable} from '@nestjs/common';
import {TenantRepository} from "../../repositories/tenant/tenant.repository";
import {Tenant} from "../../models/tenant.model";
import {DefaultCrudRepository, EntityNotFoundError} from "@loopback/repository";
import {merge} from 'lodash';
import {parse} from "psl";

@Injectable()
export class TenantService {

    private _tenant: Tenant | null = null;

    constructor(
        private tenantRepo: TenantRepository,
    ) {
    }

    get tenant() {
        return this._tenant;
    }

    set tenant(tenant: Tenant) {
        this._tenant = tenant;
    }

    async setTenantBy(site: string) {
        const subdomain = site.split('.')[0].replace('-store', '')
        const {domain} = parse(
            site
        );
        const tenant = await this.tenantRepo.findOne({
            where: {
                or: [
                    {fallback_subdomain: subdomain},
                    {site: domain}
                ]
            }
        });

        if (!tenant) {
            throw new EntityNotFoundError(Tenant, site);
        }
        this.tenant = tenant;
    }

    applyTenantScope(repo: DefaultCrudRepository<any, any>) {
        repo.modelClass.observe('access', (ctx, next) => {
            if(this.tenant) {
                ctx.query.where = merge(
                    ctx.query.where,
                    {
                        and: [
                            {tenant_id: this.tenant.id}
                        ]
                    },
                )
            }

            next();
        })
    }
}
