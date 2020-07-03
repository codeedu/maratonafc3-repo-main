import {Entity,  property} from '@loopback/repository';
import {Exclude} from "class-transformer";

export class BaseTenantModel extends Entity {

  @Exclude()
  @property({
    type: 'string',
    required: true,
  })
  tenant_id: string;
}
