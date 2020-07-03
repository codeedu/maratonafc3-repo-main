import {DefaultCrudRepository} from '@loopback/repository';
import {Entity} from "@loopback/repository";
//@ts-ignore
import {Client} from 'es6';

export abstract class BaseRepository<
    T extends Entity,
    ID,
    Relations extends object = {}
    > extends DefaultCrudRepository<T,
    ID,
    Relations> {

    async addMany(id, {relation, data}: { relation: string, data: Array<object> }) {
        const document = {
            index: this.dataSource.settings.index,
            refresh: true,
            body: {
                query: {
                    terms: {_id: [id]}
                },
                "script": {
                    "source": `
                        if ( !ctx._source.containsKey('${relation}') ) {
                            ctx._source['${relation}'] = []
                        }
                        for(item in params['${relation}']){
                           if(ctx._source['${relation}'].find( i -> i.id == item.id ) == null ) {
                             ctx._source['${relation}'].add( item )
                           }
                        }
                    `,
                    "params": {
                        [relation]: data
                    }
                },
            },
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db: Client = (this.dataSource.connector as any).db;
        await db.update_by_query(document)
    }
}
