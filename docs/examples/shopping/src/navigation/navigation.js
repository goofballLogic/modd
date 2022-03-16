import { shoppingPageRequested } from "./navigation-messages.js";
import { cartBehaviourRequested } from "../cart/cart-messages.js";
import { productListBehaviourRequested } from "../product-listing/product-listing-messages.js";

export default function Navigation() {

    return (messageType, messageData) => {
        if (messageType === shoppingPageRequested) {
            const { cart, productListing } = messageData;
            return [
                [productListBehaviourRequested, { productListing }],
                [cartBehaviourRequested, { cart }]
            ];
        }
    }
}