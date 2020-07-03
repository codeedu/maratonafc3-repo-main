import {Controller, Get, Render, Req} from '@nestjs/common';
import {CartService} from "../../services";
import MainDependencies from "../../decorators/main-dependencies.decorator";
import {Request} from "express";

@Controller('checkout*')
export class CheckoutController {

    constructor(
        private cartService: CartService
    ) {
    }


    @MainDependencies()
    @Get('/payment-success')
    @Render('checkout/payment-success')
    success(@Req() req: Request) {

        req.session.cart = null;
        const oldCartItems = this.cartService.enumerateItems
        this.cartService.clear();

        return {
            oldCartItems
        }
    }

    @MainDependencies()
    @Get('')
    @Render('checkout')
    async index(@Req() request) {
        return {
            layout: false,
        }
    }
}
