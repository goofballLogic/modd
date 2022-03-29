import Cart from "./cart.js";
import ProductListing from "./product-listing.js";
import Inventory from "./inventory.js";
import Navigation from "./navigation.js";
import Checkout from "./checkout.js";
import Aggregate from "../lib/aggregate.js";
import { shoppingPageRequested } from "./messages/navigation.js";
import ConsoleLog from "./console-log.js";

const domain = Aggregate("shopping domain", [
    Cart(),
    ProductListing(),
    Inventory(),
    Navigation(),
    Checkout(),
    ConsoleLog("debug")
]);

domain(
    shoppingPageRequested,
    {
        cart: "modd-cart",
        productListing: "modd-product-listing"
    }
);