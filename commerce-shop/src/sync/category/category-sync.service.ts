import { Injectable } from '@nestjs/common';
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";
import {CategoryRepository} from "../../repositories/category/category.repository";
import {BaseModelSyncService} from "../base-model-sync.service";
import {ModuleRef} from "@nestjs/core";

@Injectable()
export class CategorySyncService extends BaseModelSyncService{

    constructor(
        moduleRef: ModuleRef,
        private repo: CategoryRepository
    ) {
        super(moduleRef)
    }

    @RabbitSubscribe({
        exchange: 'amq.topic',
        routingKey: 'model.category.*', //expressao regular created updated deleted
        queue: 'commerce-shop/sync-admin/category'
    })
    public async rpcHandler(data, message) {
        await this.sync({
            repo: this.repo,
            data,
            message
        });
    }
}
