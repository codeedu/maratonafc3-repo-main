import {Controller, Get, Query, Render} from '@nestjs/common';
import {CategoryRepository, ProductRepository} from "../../repositories";
import MainDependencies from "../../decorators/main-dependencies.decorator";
import {Filter} from "@loopback/repository";
import {Product} from "../../models/product.model";
import {Pagination, PaginationData} from "../../decorators/pagination.decorator";
import {OrderProducts, OrderProductsData} from "../../decorators/order-product.decorator";

@Controller('search')
export class SearchController {

    constructor(
        private productRepo: ProductRepository,
        private categoryRepo: CategoryRepository,
    ) {
    }

    @MainDependencies()
    @Get()
    @Render('category/show')
    async show(
        @Query('search') search: string,
        @Pagination({limit: 15}) pagination: PaginationData,
        @OrderProducts() order: OrderProductsData
    ) {

        const filterRepo: Filter<Product> = {
            order: ['_score DESC', ...order.order],
            where: {
                or: [
                    {
                        // @ts-ignore
                        fuzzy: {
                            name: search,
                        }
                    },
                    {
                        // @ts-ignore
                        fuzzy: {
                            description: search
                        }
                    }
                ]
            }
        };

        const products = await this.productRepo.find(filterRepo)
        const {count} = await this.productRepo.count(filterRepo.where);

        return {
            search,
            pagination: {
                ...pagination,
                countPages: pagination.countPages(count)
            },
            order: order.orderParam,
            totalProducts: count,
            products
        }
    }
}
