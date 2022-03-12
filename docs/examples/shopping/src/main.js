import Cart from "./cart/cart.js";
import ProductListing from "./product-listing/product-listing.js";
import Inventory from "./inventory/inventory.js";
import Navigation from "./navigation/navigation.js";
import Checkout from "./checkout/checkout.js";
import Aggregate from "../lib/aggregate.js";

import { shoppingPageRequested } from "./navigation/navigation-messages.js";
import { checkoutWasRequested } from "./checkout/checkout-messages.js";

const domain = Aggregate("shopping domain", [
    Cart(),
    ProductListing(),
    Inventory(),
    Navigation(),
    Checkout(),
    Outcome()
]);

domain(shoppingPageRequested);

function Outcome() {
    return async (messageType, messageData) => {
        if (messageType === checkoutWasRequested) {
            const digest = Object
                .entries(messageData.items)
                .map(([itemId, quantity]) => `${quantity} x item ${itemId}`)
                .join(", and ");
            alert(`Checkout requested for ${digest}`);
        }
    }
}