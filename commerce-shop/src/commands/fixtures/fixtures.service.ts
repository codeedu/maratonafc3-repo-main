import { Injectable } from '@nestjs/common';
import {ConsoleService} from "nestjs-console";
import {ModuleRef} from "@nestjs/core";
import {EsDataSourceService} from "../../elasticsearch/es-data-source/es-data-source.service";
//@ts-ignore
import {Client} from 'es7';
import fixtures from './json';
import {DefaultCrudRepository} from "@loopback/repository";
import chalk from 'chalk';

@Injectable()
export class FixturesService {
    constructor(
        private readonly consoleService: ConsoleService,
        private moduleRef: ModuleRef,
        private dataSource: EsDataSourceService
    ) {
        const cli = this.consoleService.getCli();

        this.consoleService.createCommand(
            {
                command: 'fixtures',
                description: 'Seed data in database'
            },
            this.seed,
            cli
        );
    }

    seed = async () => {
        await this.deleteAllDocuments();

        for(const fixture of fixtures){
            const repository = this.getRepository(fixture.model) as DefaultCrudRepository<any, any>;
            await repository.create(fixture.fields);
        }

        console.log(chalk.green('Documents generated'))

    };

    async deleteAllDocuments() {
        //@ts-ignore
        const connector = this.dataSource.adapter;
        //@ts-ignore
        const client: Client = this.dataSource.adapter.db;
        await client.deleteByQuery({
            index: connector.settings.index,
            body: {
                query: {
                    match_all: {}
                }
            }
        });
    }

    getRepository<T>(name): T {
        return this.moduleRef.get(`${name}Repository`);
    }
}
