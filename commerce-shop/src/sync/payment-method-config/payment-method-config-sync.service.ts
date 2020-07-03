import { Injectable } from '@nestjs/common';
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";
import {BaseModelSyncService} from "../base-model-sync.service";
import {ModuleRef} from "@nestjs/core";
import {PaymentMethodConfigRepository} from "../../repositories/payment-method-config/payment-method-config.repository";

@Injectable()
export class PaymentMethodConfigSyncService extends BaseModelSyncService{

    constructor(
        moduleRef: ModuleRef,
        private repo: PaymentMethodConfigRepository
    ) {
        super(moduleRef)
    }

    @RabbitSubscribe({
        exchange: 'amq.topic',
        routingKey: 'model.paymentmethodconfig.*',
        queue: 'commerce-shop/sync-admin/payment_method_config'
    })
    public async rpcHandler(data, message) {
        await this.sync({
            repo: this.repo,
            data: {
                ...data,
                payment_method_id: data['payment_method']
            },
            message
        });
    }
}
