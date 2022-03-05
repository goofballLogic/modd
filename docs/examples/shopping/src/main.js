import Cart from "./cart/cart.js";
import ProductListing from "./product-listing/product-listing.js";
import Inventory from "./inventory/inventory.js";
import Navigation from "./navigation/navigation.js";
import Checkout from "./checkout/checkout.js";
import Aggregate from "../lib/aggregate.js";

import { shoppingPageRequested } from "./navigation/navigation-messages.js";

const domain = Aggregate("shopping domain", [
    Cart(),
    ProductListing(),
    Inventory(),
    Navigation(),
    Checkout()
]);

domain(shoppingPageRequested);