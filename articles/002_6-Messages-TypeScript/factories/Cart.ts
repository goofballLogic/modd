import { AddedToCart, CartTotalsUpdated } from "../taxonomy.js";

export function Cart() {

    //const added = [];
    let items = 0;
    let total = 0;

    return message => {

        if(message instanceof AddedToCart) {

            //const { quantity, sku, price } = message;
            //const [ quantity, price ] = [message["quantity"], message["price"]];

            const { quantity, price } = message;
            //added.push({ quantity, sku, price });
            total += (quantity * price);
            items += quantity;
            return CartTotalsUpdated({ items, total });

        }

    };

}
