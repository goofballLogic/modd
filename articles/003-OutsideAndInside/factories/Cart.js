import { AddedToCart, CartTotalsUpdated } from "../taxonomy.js";

export function Cart() {

    let added = [];
    let items = 0;
    let total = 0;

    return message => {

        if(message instanceof AddedToCart) {

            const { quantity, sku, price } = message;
            added.push({ quantity, sku, price });
            total += (quantity * price);
            items += quantity;
            return CartTotalsUpdated({ items, total });

        }

    };

}
