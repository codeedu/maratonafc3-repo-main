import { applyDecorators } from '@nestjs/common';
import {CartView} from "./cart.decorator";
import CategoriesDefault from "./categories-default.decorator";
import PaymentMethodConfigGreaterInstallmentsDecorator from "./payment-method-config-greater-installments.decorator";
import {Tenant} from "./tenant.decorator";

function MainDependencies() {
    return applyDecorators(
        Tenant(),
        CartView(),
        CategoriesDefault(),
        PaymentMethodConfigGreaterInstallmentsDecorator()
    );
}

export default MainDependencies;
