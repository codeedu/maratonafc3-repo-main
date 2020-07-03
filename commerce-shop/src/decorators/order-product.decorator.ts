import {createParamDecorator, ExecutionContext, SetMetadata} from "@nestjs/common";
import {Request} from "express";

enum OrderProductQueryParam {
    ALL = 'todos',
    BEST_SELLERS = 'mais_vendidos',
    LOWEST_PRICE = 'menor_preco',
    BIGGEST_PRICE = 'maior_preco',
}

export interface OrderProductsData {
    order?: any;
    orderParam: OrderProductQueryParam
}

export const OrderProducts = createParamDecorator<any, any, OrderProductsData>(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();
        const orderParam = request.query.order;
        switch (orderParam) {
            case OrderProductQueryParam.BEST_SELLERS:
                return {
                    order: ['count_sales DESC'],
                    orderParam: OrderProductQueryParam.BEST_SELLERS
                }
            case OrderProductQueryParam.LOWEST_PRICE:
                return {
                    order: ['price ASC'],
                    orderParam: OrderProductQueryParam.LOWEST_PRICE
                }
            case OrderProductQueryParam.BIGGEST_PRICE:
                return {
                    order: ['price DESC'],
                    orderParam: OrderProductQueryParam.BIGGEST_PRICE
                }
            default:
                return {
                    order: [],
                    orderParam: OrderProductQueryParam.ALL
                }
        }
    },
);
