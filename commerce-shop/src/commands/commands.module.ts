import { Module } from '@nestjs/common';
import {ConsoleModule} from "nestjs-console";
import {FixturesService} from "./fixtures/fixtures.service";
import {EsDataSourceService} from "../elasticsearch/es-data-source/es-data-source.service";
import {TenantRepository} from "../repositories/tenant/tenant.repository";
import {CategoryRepository} from "../repositories/category/category.repository";
import {ProductRepository} from "../repositories/product/product.repository";
import {TenantService} from "../services/tenant/tenant.service";
import {PaymentMethodRepository} from "../repositories/payment-method/payment-method.repository";
import {PaymentMethodConfigRepository} from "../repositories/payment-method-config/payment-method-config.repository";

@Module({
    imports: [
        ConsoleModule
    ],
    providers: [
        PaymentMethodRepository,
        PaymentMethodConfigRepository,
        TenantService,
        FixturesService,
        EsDataSourceService,
        TenantRepository,
        CategoryRepository,
        ProductRepository,
    ]
})
export class CommandsModule {}
