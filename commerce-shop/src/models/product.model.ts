import {model, property} from '@loopback/repository';
import {SmallCategory} from "./category.model";
import {BaseTenantModel} from "./base-tenant.model";
import {Exclude} from "class-transformer";

interface ProductPaymentMethods {
    payment_method_id: string;
    max_installments?: number;
    max_installments_discount?: number;
    discount_percentage?: number;
}

@model()
export class Product extends BaseTenantModel {

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
    description: string;

    @property({
        type: 'string',
        required: true,
    })
    slug: string;

    @property({
        type: 'number',
        required: true,
    })
    price: number;

    @property({
        type: 'boolean',
        required: true,
        default: false
    })
    featured: boolean;

    @property({
        type: 'string',
        required: true,
    })
    image_url: string;

    @Exclude()
    @property({
        type: 'number',
        required: true,
    })
    count_sales: boolean;

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

    @property({
        type: 'object',
        required: true,
        jsonSchema: {
            relation: true,
            model: 'Category',
            properties: {
                id: {
                    type: "string"
                },
                name: {
                    type: "string"
                },
                slug: {
                    type: "string"
                }
            }
        },
    })
    category: SmallCategory;

    @property({
        type: 'object',
        required: false,
        jsonSchema: {
            type: 'array',
            relation: true,
            items: {
                type: "object",
                properties: {
                    payment_method_id: {
                        type: "string"
                    },
                    max_installments: {
                        type: "number",
                        nullable: true
                    },
                    max_installments_discount: {
                        type: "number",
                        nullable: true
                    },
                    discount_percentage: {
                        type: "number",
                        nullable: true
                    }
                }
            },
        },
    })
    payment_methods: Array<ProductPaymentMethods>;

    constructor(data?: Partial<Product>) {
        super(data);
    }
}
