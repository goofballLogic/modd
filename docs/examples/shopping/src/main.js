import Cart from "./cart/cart.js";
import ProductListing from "./product-listing/product-listing.js";
import Inventory from "./inventory/inventory.js";
import Navigation from "./navigation/navigation.js";
import Checkout from "./checkout/checkout.js";
import Aggregate from "../lib/aggregate.js";

import { shoppingPageRequested } from "./navigation/navigation-messages.js";
import { checkoutWasRequested } from "./checkout/checkout-messages.js";
import { Logged } from "../lib/log.js";
import Filter from "../lib/filter.js";
import { productListBehaviourRequested } from "./product-listing/product-listing-messages.js";
import { availableProductsDetermined } from "./inventory/inventory-messages.js";

const domain = Aggregate("shopping domain", [
    Cart(),
    Filter([productListBehaviourRequested, availableProductsDetermined], ProductListing()),
    Inventory(),
    Navigation(),
    Checkout(),
    Outcome(),
    ConsoleLog("trace")
]);

domain(
    shoppingPageRequested,
    {
        cart: "modd-cart",
        productListing: "modd-product-listing"
    }
);

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

function ConsoleLog(minLogLevel = "debug") {

    const logLevels = {
        "logging": 0,
        "trace": 1,
        "debug": 2,
        "warn": 3,
        "error": 4
    };

    minLogLevel = logLevels[minLogLevel];

    return async (messageType, messageData) => {
        if (messageType === Logged) {
            const { level, message, source } = messageData;
            const messageLogLevel = logLevels[level];
            if (minLogLevel > messageLogLevel) return;

            console.group(level.toUpperCase(), source);
            for (const x of Array.isArray(message) ? message : [message]) {
                switch (level) {
                    case "error":
                        console.error(x);
                        break;
                    case "warn":
                        console.warn(x);
                        break;
                    default:
                        console.log(x);
                }
            }
            console.groupEnd();
        }
    };
}
