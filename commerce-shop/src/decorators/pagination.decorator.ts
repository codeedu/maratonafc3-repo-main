import {createParamDecorator, ExecutionContext, SetMetadata} from "@nestjs/common";
import {Request} from "express";

export interface PaginationData {
    page: number,
    limit: number;
    offset: number;
    countPages: (count: number) => number
}

export const Pagination = createParamDecorator<any, any, PaginationData>(
    ({limit}, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();
        const pageParam = request.query.page;
        const page = +pageParam > 0 ? +pageParam : 1;
        return {
            page,
            limit: limit,
            offset: (page - 1) * limit,
            countPages: (count) => ((count + limit - 1) / limit | 0)
        }
    },
);
