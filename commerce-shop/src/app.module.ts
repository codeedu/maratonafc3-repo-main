import {Module, NestModule, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import {ElasticsearchModule} from './elasticsearch/elasticsearch.module';
import {ConfigModule} from '@nestjs/config';
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {
    CategorySyncService,
    PaymentMethodSyncService,
    PaymentMethodConfigSyncService,
    ProductSyncService,
    TenantSyncService
} from './sync';
import {
    CategoryRepository,
    PaymentMethodRepository,
    PaymentMethodConfigRepository,
    ProductRepository,
    TenantRepository
} from './repositories';
import {CommandsModule} from './commands/commands.module';
import {TenantMiddleware} from "./middlewares/tenant.middleware";
import {
    CartService,
    TenantService
} from './services';
import {
    CartController,
    CategoryController,
    CheckoutController,
    HomeController,
    ProductController
} from './controllers';
import {CartInterceptor} from "./interceptors/cart.interceptor";
import {CategoriesDefaultInterceptor} from "./interceptors/categories-default.interceptor";
import {PaymentMethodConfigGreaterInstallmentsInterceptor} from "./interceptors/payment-method-config-greater-installments.interceptor";
import { SearchController } from './controllers/search/search.controller';
import {TenantInterceptor} from "./interceptors/tenant.interceptor";

@Module({
    imports: [
        ConfigModule.forRoot(),
        ElasticsearchModule,
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            useFactory: () => ({
                uri: process.env.RABBITMQ_URI
            }),
        }),
        CommandsModule,
    ],
    controllers: [
        CartController,
        CategoryController,
        CheckoutController,
        HomeController,
        ProductController,
        SearchController,
    ],
    providers: [
        CategorySyncService,
        ProductSyncService,
        TenantSyncService,
        PaymentMethodSyncService,
        PaymentMethodConfigSyncService,
        CategoryRepository,
        ProductRepository,
        TenantRepository,
        PaymentMethodRepository,
        PaymentMethodConfigRepository,
        TenantService,
        CartService,
        {
            provide: APP_INTERCEPTOR,
            useClass: TenantInterceptor
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CartInterceptor
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CategoriesDefaultInterceptor
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: PaymentMethodConfigGreaterInstallmentsInterceptor
        },
    ],
})
export class AppModule implements NestModule {

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TenantMiddleware)
            .forRoutes({
                path: '*', method: RequestMethod.ALL
            });
    }
}
