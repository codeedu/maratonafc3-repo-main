import {Injectable, OnModuleInit} from '@nestjs/common';
import {Category} from "../../models/category.model";
import {EsDataSourceService} from "../../elasticsearch/es-data-source/es-data-source.service";
import {TenantService} from "../../services/tenant/tenant.service";
import {BaseRepository} from "../base.repository";

@Injectable()
export class CategoryRepository extends BaseRepository<
    Category,
    typeof Category.prototype.id
    > implements OnModuleInit{
    constructor(
        dataSource: EsDataSourceService,
        private tenantService: TenantService
    ) {
        super(Category, dataSource);
    }

    onModuleInit(): any {
        this.tenantService.applyTenantScope(this);
    }
}
