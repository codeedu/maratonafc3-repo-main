import {Controller, Get, NotFoundException, Param, Render, Req} from '@nestjs/common';
import {ProductRepository} from "../../repositories";
import MainDependencies from "../../decorators/main-dependencies.decorator";

@Controller('product')
export class ProductController {

    constructor(
        private productRepo: ProductRepository,
    ) {
    }

    @MainDependencies()
    @Get(':slug')
    @Render('product/show')
    async show(
        @Req() request,
        @Param('slug') slug: string
    ) {
        const product = await this.productRepo.findOne({where: {slug}})
        if (!product) {
            throw new NotFoundException('Produto não existe');
        }

        const categorizedProducts = await this.productRepo.findOne({
            where: {
                // @ts-ignore
                'category.id': product.category.id
            }
        })

        return {
            product,
            categorizedProducts,
        }
    }
}
