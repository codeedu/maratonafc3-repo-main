import {Injectable} from '@nestjs/common';
import {CategoryRepository} from "../../repositories/category/category.repository";
import {PaymentMethodConfigRepository} from "../../repositories/payment-method-config/payment-method-config.repository";
import {CartService} from "../cart/cart.service";
import {Request} from "express";
import {TenantService} from "../tenant/tenant.service";

@Injectable()
export class NavbarService {


    constructor(
        private categoryRepo: CategoryRepository,
        private paymentMethodConfig: PaymentMethodConfigRepository,
        private cartService: CartService,
        private tenantService: TenantService
    ) {
    }


    async getDependencies(request){
        this.loadCart(request);
        return {
            domain: {
                site: this.tenantService.tenant.site,
                fallback_subdomain: this.tenantService.tenant.fallback_subdomain,
            },
            // categories: await this.categoryRepo.find({
            //     order: ['name.keyword DESC']
            // }),
            payMethodConfig: (await this.paymentMethodConfig.find({
                order: ['max_installments DESC']
            }))[0],
          //  cart: this.cartService
        }

    }

    loadCart(request: Request,){
        this.cartService.deserialize(request.session.cart || {});
    }
}
