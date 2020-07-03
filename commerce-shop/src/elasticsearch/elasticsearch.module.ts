import { Module } from '@nestjs/common';
import { EsDataSourceService } from './es-data-source/es-data-source.service';
import {ConfigService} from "@nestjs/config";

@Module({
  providers: [EsDataSourceService, ConfigService],
  exports: [EsDataSourceService]
})
export class ElasticsearchModule {}
