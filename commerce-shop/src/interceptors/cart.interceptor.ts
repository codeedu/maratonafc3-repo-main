import {CallHandler, ExecutionContext, Injectable, NestInterceptor, Scope} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from "@nestjs/core";
import {map} from "rxjs/operators";
import {CartService} from "../services";

@Injectable({
    scope: Scope.REQUEST
})
export class CartInterceptor implements NestInterceptor {

    constructor(
        private reflector: Reflector,
        private cartService: CartService,
    ) {

    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const hasCartView = this.hasCartViewDecorator(context);
        const hasCartJson = this.hasCartJsonDecorator(context);
        const request = context.switchToHttp().getRequest();
        if (hasCartView || hasCartJson) {
            this.cartService.deserialize(request.session.cart || {});
        }
        return next
            .handle()
            .pipe(
                map(responseData => {
                    if (hasCartView) {
                        return {
                            ...responseData,
                            cart: this.cartService
                        }
                    }
                    return responseData;
                })
            )
            ;
    }

    hasCartViewDecorator(context: ExecutionContext) {
        return this.reflector.get('cart-view', context.getHandler());
    }

    hasCartJsonDecorator(context: ExecutionContext) {
        return this.reflector.get('cart-json', context.getHandler());
    }
}
