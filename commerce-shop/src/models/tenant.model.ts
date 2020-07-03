import {Entity, model, property} from '@loopback/repository';

@model()
export class Tenant extends Entity {

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
  company: string;

  @property({
    type: 'string',
    required: true,
  })
  site: string;

  @property({
    type: 'string',
    required: true,
  })
  fallback_subdomain: string;

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

  constructor(data?: Partial<Tenant>) {
    super(data);
  }
}
