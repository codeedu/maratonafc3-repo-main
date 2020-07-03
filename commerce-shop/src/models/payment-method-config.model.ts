import {model, property} from '@loopback/repository';
import {BaseTenantModel} from "./base-tenant.model";

@model()
export class PaymentMethodConfig extends BaseTenantModel {

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
  payment_method_id: string;

  @property({
    type: 'number',
    required: false,
    default: 0
  })
  max_installments: number;

  @property({
    type: 'number',
    required: false,
    default: 0
  })
  discount_percentage: number;

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

  constructor(data?: Partial<PaymentMethodConfig>) {
    super(data);
  }
}
