import {Injectable, OnModuleInit} from '@nestjs/common';
import {PaymentMethodConfig} from "../../models/payment-method-config.model";
import {EsDataSourceService} from "../../elasticsearch/es-data-source/es-data-source.service";
import {TenantService} from "../../services/tenant/tenant.service";
import {BaseRepository} from "../base.repository";

@Injectable()
export class PaymentMethodConfigRepository extends BaseRepository<
    PaymentMethodConfig,
    typeof PaymentMethodConfig.prototype.id
    > implements OnModuleInit{
    constructor(
        dataSource: EsDataSourceService,
        private tenantService: TenantService
    ) {
        super(PaymentMethodConfig, dataSource);
    }

    onModuleInit(): any {
        this.tenantService.applyTenantScope(this);
    }
}
