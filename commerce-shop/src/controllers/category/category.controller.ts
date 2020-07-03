import {Controller, Get, NotFoundException, Param, Query, Render} from '@nestjs/common';
import {ProductRepository} from "../../repositories";
import {CategoryRepository} from "../../repositories";
import MainDependencies from "../../decorators/main-dependencies.decorator";
import {Filter} from "@loopback/repository";
import {Product} from "../../models/product.model";
import {Pagination, PaginationData} from "../../decorators/pagination.decorator";
import {OrderProducts, OrderProductsData} from "../../decorators/order-product.decorator";

@Controller('category')
export class CategoryController {

    constructor(
        private productRepo: ProductRepository,
        private categoryRepo: CategoryRepository,
    ) {
    }

    @MainDependencies()
    @Get(':slug')
    @Render('category/show')
    async show(
        @Param('slug') slug: string,
        @Pagination({limit: 15}) pagination: PaginationData,
        @OrderProducts() order: OrderProductsData
    ) {
        const category = await this.categoryRepo.findOne({where: {slug}})
        if (!category) {
            throw new NotFoundException('Categoria não existe');
        }

        const filterRepo: Filter<Product> = {
            order: order.order,
            limit: pagination.limit,
            offset: pagination.offset,
            where: {
                // @ts-ignore
                'category.id': category.id
            }
        };

        const products = await this.productRepo.find(filterRepo)
        const {count} = await this.productRepo.count(filterRepo.where);

        return {
            pagination: {
                ...pagination,
                countPages: pagination.countPages(count)
            },
            order: order.orderParam,
            totalProducts: count,
            category,
            products
        }
    }
}
