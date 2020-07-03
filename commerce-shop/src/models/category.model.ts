import {Entity, model, property} from '@loopback/repository';
import {BaseTenantModel} from "./base-tenant.model";

export interface SmallCategory {
  id: string;
  name: string;
}

@model()
export class Category extends BaseTenantModel {

  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  slug: string;

  @property({
    type: 'date',
    required: true,
  })
  created_at: string;

  @property({
    type: 'date',
    required: true,
  })
  updated_at: string;

  constructor(data?: Partial<Category>) {
    super(data);
  }
}
