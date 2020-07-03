import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Reflector} from "@nestjs/core";
import {PaymentMethodConfigRepository} from "../repositories";
import {map} from "rxjs/operators";

@Injectable()
export class PaymentMethodConfigGreaterInstallmentsInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private paymentMethodConfig: PaymentMethodConfigRepository,
    ) {
    }

    async intercept(context: ExecutionContext, next: CallHandler) {
        let payMethodConfigs;
        const hasDecorator = this.hasDecorator(context);
        if (hasDecorator) {
            payMethodConfigs = await this.paymentMethodConfig.find({
                order: ['max_installments DESC']
            });
        }
        return next.handle()
            .pipe(
                map(responseData => {
                    if(hasDecorator) {
                        return {
                            ...responseData,
                            ...(payMethodConfigs && payMethodConfigs.length && {payMethodConfig: payMethodConfigs[0]})
                        }
                    }

                    return responseData;
                })
            );
    }

    hasDecorator(context: ExecutionContext) {
        return this.reflector.get('payment-method-config-greater-installments', context.getHandler());
    }
}
