import { shoppingPageRequested } from "./navigation-messages.js";
import { cartBehaviourRequested } from "../cart/cart-messages.js";
import { productListBehaviourRequested } from "../product-listing/product-listing-messages.js";

export default function Navigation() {

    return (messageType) => {
        if (messageType === shoppingPageRequested) {
            return [
                [productListBehaviourRequested],
                [cartBehaviourRequested]
            ];
        }
    }
}