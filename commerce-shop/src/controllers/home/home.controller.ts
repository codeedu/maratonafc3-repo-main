import {Controller, Get, Render} from '@nestjs/common';
import {
    CategoryRepository,
    ProductRepository,
} from "../../repositories";
import MainDependencies from "../../decorators/main-dependencies.decorator";

@Controller('')
export class HomeController {

    constructor(
        private categoryRepo: CategoryRepository,
        private productRepo: ProductRepository,
    ) {
    }

    @MainDependencies()
    @Get()
    @Render('home')
    async index() {
        const featuredProducts = await this.productRepo.find({
            limit: 10,
            where: {
                featured: true
            }
        });
        const topSellingProducts = await this.productRepo.find({
            order: ['count_sales DESC'],
            limit: 10,
        });

        return {
            featuredProducts,
            topSellingProducts,
        }
    }
}
