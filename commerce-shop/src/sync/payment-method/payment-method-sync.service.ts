import { Injectable } from '@nestjs/common';
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";
import {BaseModelSyncService} from "../base-model-sync.service";
import {ModuleRef} from "@nestjs/core";
import {PaymentMethodRepository} from "../../repositories";
@Injectable()
export class PaymentMethodSyncService extends BaseModelSyncService{

    constructor(
        moduleRef: ModuleRef,
        private repo: PaymentMethodRepository
    ) {
        super(moduleRef)
    }


    @RabbitSubscribe({
        exchange: 'amq.topic',
        routingKey: 'model.paymentmethod.*',
        queue: 'commerce-shop/sync-admin/payment_method'
    })
    public async rpcHandler(data, message) {
        await this.sync({
            repo: this.repo,
            data,
            message
        });
    }

}
