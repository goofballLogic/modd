import Filter from "../../lib/filter.js";
import { cartUpdated, itemQuantityWasChanged, itemWasAddedToCart, itemWasRemovedFromCart } from "./cart-messages.js";

const clone = x => JSON.parse(JSON.stringify(x));

export default function CartContent() {

    const cartItems = {};

    return Filter(
        [itemQuantityWasChanged, itemWasAddedToCart, itemWasRemovedFromCart],
        handleMessages
    );

    function handleMessages(messageData, messageType) {
        const { itemId, quantity } = messageData;
        switch (messageType) {
            case itemWasAddedToCart:
                cartItems[itemId] = (cartItems[itemId] || 0) + 1;
                break;
            case itemWasRemovedFromCart:
                if (itemId in cartItems)
                    delete cartItems[itemId];
                break;
            case itemQuantityWasChanged:
                cartItems[itemId] = quantity;
                break;
        }
        return [
            [cartUpdated, { items: clone(cartItems) }]
        ];
    }
}
