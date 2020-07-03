import {Injectable, Scope} from '@nestjs/common';
import {Product} from "../../models/product.model";
import {Exclude, Expose} from 'class-transformer';

interface CartItem {
    [id: string]: { product: Product, quantity: number }
}

@Injectable({
    scope: Scope.REQUEST
})
export class CartService {

    private updated = false;

    @Exclude()
    items: CartItem = {}

    add(product: Product) {
        this.updated = true;
        let quantity = product.id in this.items ? this.items[product.id].quantity : 0;
        this.items[product.id] = {
            product,
            quantity: ++quantity
        }
    }

    clear() {
        this.updated = true;
        this.items = {};
    }

    isUpdated(){
        return this.updated;
    }

    @Expose()
    get countItems(): number {
        return Object.keys(this.items).reduce((sum, value) => {
            return sum + this.items[value].quantity;
        }, 0)
    }

    @Expose()
    get total(): number {
        return Object.keys(this.items).reduce(((sum, value) => {
            const item = this.items[value];
            return sum + item.product.price * item.quantity;
        }), 0)
    }

    @Expose({name: 'items'})
    get enumerateItems(){
        return this.toArray()
    }

    toArray() {
        return Object.keys(this.items).map(key => this.items[key])
    }

    serialize() {
        return Object.keys(this.items).reduce(((obj, value) => {
            const item = this.items[value];
            obj[value] = {
                product: item.product.toJSON(),
                quantity: item.quantity
            }
            return obj;
        }), {})
    }

    deserialize(items) {
        this.items = Object.keys(items).reduce(((obj, value) => {
            const item = items[value];
            obj[value] = {
                product: new Product(item.product),
                quantity: item.quantity
            }
            return obj;
        }), {})
    }
}
