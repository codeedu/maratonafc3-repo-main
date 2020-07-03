import {Injectable, OnModuleInit} from '@nestjs/common';
import {Product} from "../../models/product.model";
import {EsDataSourceService} from "../../elasticsearch/es-data-source/es-data-source.service";
import {BaseRepository} from "../base.repository";
import {TenantService} from "../../services";

@Injectable()
export class ProductRepository extends BaseRepository<
    Product,
    typeof Product.prototype.id
    > implements OnModuleInit{
    constructor(
        dataSource: EsDataSourceService,
        private tenantService: TenantService
    ) {
        super(Product, dataSource);
    }

    onModuleInit(): any {
        this.tenantService.applyTenantScope(this);
    }
}


