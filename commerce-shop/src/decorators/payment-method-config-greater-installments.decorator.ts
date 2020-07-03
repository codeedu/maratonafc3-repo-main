import {SetMetadata} from "@nestjs/common";

const PaymentMethodConfigGreaterInstallmentsDecorator = () => SetMetadata('payment-method-config-greater-installments', true);

export default PaymentMethodConfigGreaterInstallmentsDecorator;
