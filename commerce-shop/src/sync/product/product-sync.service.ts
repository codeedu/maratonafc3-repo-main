import { Injectable } from '@nestjs/common';
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";
import {BaseModelSyncService} from "../base-model-sync.service";
import {ProductRepository} from "../../repositories/product/product.repository";
import {pick} from 'lodash';
import {ModuleRef} from "@nestjs/core";
@Injectable()
export class ProductSyncService extends BaseModelSyncService{

    constructor(
        moduleRef: ModuleRef,
        private repo: ProductRepository
    ) {
        super(moduleRef)
    }


    @RabbitSubscribe({
        exchange: 'amq.topic',
        routingKey: 'model.product.*',
        queue: 'commerce-shop/sync-admin/product'
    })
    public async rpcHandler(data, message) {
        await this.sync({
            repo: this.repo,
            data: {
                ...pick(data, this.getModelFields(this.repo)),
                price: data['sale_price'],
                tenant_id: data['tenant'],
                count_sales: 1
            },
            message
        });
    }


    @RabbitSubscribe({
        exchange: 'amq.topic',
        routingKey: 'model.productpaymentmethod.*',
        queue: 'commerce-shop/sync-admin/product_payment_method'
    })
    public async handlerCategories(data, message) {
        // if (this.getAction(message) === 'created') {
        //     const fields = Object.keys(this.repo.modelClass.definition.properties['payment_methods'].jsonSchema.items.properties)
        //     const entity = {
        //         ...pick(data, fields),
        //         payment_method_id: data['payment_method']
        //     }
        //     console.log(data, entity, fields);
        //     await this.repo.addMany(
        //         data.product,
        //         {relation: 'payment_methods', data: [entity]}
        //     )
        // }
    }

}
