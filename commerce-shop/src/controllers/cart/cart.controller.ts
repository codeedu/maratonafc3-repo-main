import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException,
    Param,
    Render,
    Req,
    Res,
    UseInterceptors
} from '@nestjs/common';
import {Request, Response} from "express";
import "express-session";
import {CartService} from "../../services";
import {ProductRepository} from "../../repositories";
import {classToPlain} from "class-transformer";
import {CartJson, CartView} from "../../decorators/cart.decorator";
import MainDependencies from "../../decorators/main-dependencies.decorator";

@Controller('cart')
export class CartController {

    constructor(
        private cartService: CartService,
        private productRepo: ProductRepository,
    ) {
    }

    @MainDependencies()
    @Get()
    @Render('cart/show')
    async index(@Req() request) {
        return {

        }
    }

    @CartView()
    @Get('add/:product')
    async add(
        @Param('product') productId,
        @Req() request: Request,
        @Res() response: Response
    ) {
        const product = await this.productRepo.findOne({where: {id: productId}})
        if (!product) {
            throw new NotFoundException('Produto não existe');
        }
        this.cartService.add(product);
        request.session.cart = this.cartService.serialize();
        return response.redirect(request.header('Referer') || '/');
    }

    @CartJson()
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('_json')
    show() {
        return {
            ...classToPlain(this.cartService),
        }
    }
}
