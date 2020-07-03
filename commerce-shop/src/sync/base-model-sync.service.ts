import {DefaultCrudRepository, EntityNotFoundError} from "@loopback/repository";
import {Message} from "amqplib";
import {pick, omit} from 'lodash';
import {ModuleRef} from "@nestjs/core";

export interface SyncOptions {
    repo: DefaultCrudRepository<any, any>;
    data: any;
    message: Message
}

export abstract class BaseModelSyncService {

    constructor(private moduleRef: ModuleRef,) {
    }

    protected async sync({repo, data, message}: SyncOptions) {
        console.log(data, message.fields.routingKey);
        const {id} = data || {};
        const action = this.getAction(message);
        const relationFields = this.getRelationFields(repo);
        for (const relation of relationFields) {
            const result = await this.findRelation({
                relation,
                repo,
                data: Array.isArray(data[relation])? data[relation]: [data[relation]]
            });
            if(result.length) {
                const isMany = this.isRelationMany(repo, relation);
                data[relation] = isMany ? result : result[0];
            }
        }
        const entity = this.createEntity(data, repo);

        console.log(data);

        switch (action) {
            case 'created':
            case 'updated':
                await this.updateOrCreate({repo, id, entity});
                break;
            case 'deleted':
                await repo.deleteById(id);
                break;
        }
    }

    protected getModelFields(repo){
        return Object.keys(repo.modelClass.definition.properties)
    }

    protected getRelationFields(repo) {
        const properties = repo.modelClass.definition.properties;
        return Object.keys(properties).filter(
            p => properties[p].jsonSchema
                && properties[p].jsonSchema.model
                && properties[p].jsonSchema.relation === true

        )
    }

    async syncRelation({relation, id, data, repo, message,}) {
        const collection = await this.findRelation({relation, repo, data})

        if (this.getAction(message) === 'attached') {
            await repo.addMany(id, {relation, data: collection})
        }
    }

    protected async findRelation({relation, repo, data}) {
        if(!data.length){
            return []
        }

        const relationField = repo.modelClass.definition.properties[relation];
        const relationRepo = this.moduleRef.get(`${relationField.jsonSchema.model}Repository`);
        const fields = this.isRelationMany(repo, relation)
            ?Object.keys(repo.modelClass.definition.properties[relation].jsonSchema.items.properties)
            :Object.keys(repo.modelClass.definition.properties[relation].jsonSchema.properties)

        const collection = await relationRepo.find(
            {
                where: {
                    or: data.map(idRelation => ({id: idRelation})),
                },
                fields,
            }
        );

        if (!collection.length) {
            const error = new EntityNotFoundError(relationRepo.entityClass, data)
            error.name = 'EntityNotFound'
            throw error;
        }
        return collection.map(c => pick(c, fields));
    }

    protected isRelationMany(repo,relation){
        return repo.modelClass.definition.properties[relation].jsonSchema.type === "array";
    }

    protected getAction(message: Message) {
        return message.fields.routingKey.split('.')[2];
    }

    protected createEntity(data: any, repo: DefaultCrudRepository<any, any>) {
        return pick(
            this.normalizeTenantIdField(data),
            Object.keys(repo.entityClass.definition.properties)
        );
    }

    protected normalizeTenantIdField(data) {
        return 'tenant' in data
            ? omit({...data, tenant_id: data.tenant}, 'tenant')
            : data;
    }

    protected async updateOrCreate({repo, id, entity}: { repo: DefaultCrudRepository<any, any>, id: string, entity: any }) {
        const exists = await repo.exists(id);
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return exists ? repo.updateById(id, entity) : repo.create(entity)
    }
}
