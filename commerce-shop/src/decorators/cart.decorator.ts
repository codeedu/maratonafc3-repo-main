import {SetMetadata} from "@nestjs/common";

export const CartView = () =>
    SetMetadata('cart-view', true);
export const CartJson = () =>
    SetMetadata('cart-json', true);
