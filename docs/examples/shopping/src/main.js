import Cart from "./cart/cart.js";
import ProductListing from "./product-listing/product-listing.js";
import Inventory from "./inventory/inventory.js";
import Navigation from "./navigation/navigation.js";
import Checkout from "./checkout/checkout.js";

import { shoppingPageRequested } from "./navigation/navigation-messages.js";

const domain = [
    Cart(),
    ProductListing(),
    Inventory(),
    Navigation(),
    Checkout()
].filter(x => x);

const postbox = [];

postbox.push([shoppingPageRequested]);

while (postbox.length) {
    console.log(postbox.length);
    const message = postbox.shift();
    for (let entity of domain) {
        const returned = await entity.apply(entity, message);
        if (returned) {
            for (let returnedMessage of returned) {
                postbox.push(returnedMessage);
            }
        }
    }
}
