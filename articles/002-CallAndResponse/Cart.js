import { AddedToCart, CartTotals, AtCheckout, Message, Type } from "./taxonomy.js";

export function Cart() {

    let added = [];
    return message => {

        if(message[Type] === AddedToCart) {

            add(message);

        } else if(message[Type] === AtCheckout) {

            return Message(CartTotals, calculateTotals());

        }

    };

    function calculateTotals() {

        let items = 0, total = 0;
        for (const { quantity, price } of added) {

            items += quantity;
            total += price;

        }
        return { items, total };

    }

    function add({ quantity, sku, price }) {

        added.push({ quantity, sku, price });

    }


}
