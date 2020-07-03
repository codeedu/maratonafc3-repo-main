import { Injectable } from '@nestjs/common';
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";
import {BaseModelSyncService} from "../base-model-sync.service";
import {ModuleRef} from "@nestjs/core";
import {TenantRepository} from "../../repositories/tenant/tenant.repository";

@Injectable()
export class TenantSyncService extends BaseModelSyncService{

    constructor(
        moduleRef: ModuleRef,
        private repo: TenantRepository
    ) {
        super(moduleRef)
    }

    @RabbitSubscribe({
        exchange: 'amq.topic',
        routingKey: 'model.tenant.*',
        queue: 'commerce-shop/sync-admin/tenant'
    })
    public async rpcHandler(data, message) {
        await this.sync({
            repo: this.repo,
            data,
            message
        });
    }
}
