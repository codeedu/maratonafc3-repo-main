import tenants from './tenant.fixture';
import paymentMethods from './payment-method';
import paymentMethodsConfig from './payment-method-config';
import categories from './category.fixture';
import products from './product.fixture';

export default [
    ...tenants,
    ...paymentMethods,
    ...paymentMethodsConfig,
    ...categories,
    ...products
]
