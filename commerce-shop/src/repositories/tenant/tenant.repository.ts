import { Injectable } from '@nestjs/common';
import {Tenant} from "../../models/tenant.model";
import {EsDataSourceService} from "../../elasticsearch/es-data-source/es-data-source.service";
import {BaseRepository} from "../base.repository";

@Injectable()
export class TenantRepository extends BaseRepository<
    Tenant,
    typeof Tenant.prototype.id
    > {
    constructor(
        dataSource: EsDataSourceService,
    ) {
        super(Tenant, dataSource);
    }
}



