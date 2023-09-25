import { MessageReceiver } from "../messages";
import { AddedToCartData } from "../schemas";
import { AddedToCart, CartTotalsUpdated } from "../taxonomy";

export function Cart() : MessageReceiver {

    const added: AddedToCartData[] = [];
    let items = 0;
    let total = 0;

    return (message: object) => {

        if(message instanceof AddedToCart) {

            const { quantity, sku, price } = <AddedToCartData>message;
            added.push({ quantity, sku, price });
            total += (quantity * price);
            items += quantity;
            return [ CartTotalsUpdated({ items, total }) ];

        }

    };

}
