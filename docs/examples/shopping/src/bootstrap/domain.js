import Cart from "./cart.js";
import ProductListing from "./product-listing.js";
import Inventory from "./inventory.js";
import Navigation from "./navigation.js";
import Checkout from "./checkout.js";
import Aggregate from "../entities/aggregate.js";
import ConsoleLog from "../entities/console-log.js";

export default () =>
    Aggregate("shopping domain", [
        Cart(),
        ProductListing(),
        Inventory(),
        Navigation(),
        Checkout(),
        ConsoleLog("debug")
    ]);
