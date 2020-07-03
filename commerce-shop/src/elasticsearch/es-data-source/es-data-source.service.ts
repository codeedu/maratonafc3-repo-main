import { Injectable } from '@nestjs/common';
import {juggler} from '@loopback/repository';

@Injectable()
export class EsDataSourceService extends juggler.DataSource{
    static dataSourceName = 'esv7';

    constructor() {
        super(EsDataSourceService.config());
    }

    static config(){
        return {
            "name": "esv7",
            "connector": "esv6",
            "index": "commerce_shop",
            "version": 7,
            "debug": process.env.APP_ENV === 'dev',
            "defaultSize": 50,
            "configuration": {
                "node": process.env.ELASTIC_SEARCH_HOST,
                "requestTimeout": process.env.ELASTIC_SEARCH_REQUEST_TIMEOUT,
                "pingTimeout": process.env.ELASTIC_SEARCH_PING_TIMEOUT
            },
            "mappingProperties": {
                "docType": {
                    "type": "keyword",
                },
                "id": {
                    "type": "keyword",
                },
                "tenant_id": {
                    "type": "keyword",
                },
                "site": {
                    "type": "keyword",
                },
                "fallback_subdomain": {
                    "type": "keyword",
                },
                "name": {
                    "type": "text",
                    "fields": {
                        "keyword": {
                            "type": "keyword",
                            "ignore_above": 256,
                        }
                    }
                },
                "slug": {
                    "type": "keyword",
                },
                "count_sales": {
                    "type": "integer",
                },
                "image_url": {
                    "type": "keyword",
                },
                "join": {
                  "type": "join",
                  "relations": {
                      "parent_category": "child_category"
                  }
                },
                "category": {
                    "type": "nested",
                    "properties": {
                        "id": {"type": "keyword"},
                        "name": {"type": "text"},
                        "slug": {"type": "keyword"},
                    }
                },
                "payment_methods": {
                    "type": "nested",
                    "properties": {
                        "payment_method_id": {"type": "keyword"},
                        "installments": {"type": "integer"},
                        "max_installments_discount": {"type": "integer"},
                        "discount_percentage": {"type": "integer"}
                    }
                }
            }
        }
    }
}
