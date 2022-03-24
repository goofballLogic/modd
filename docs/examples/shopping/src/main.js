import Cart from "./cart/cart.js";
import ProductListing from "./product-listing/product-listing.js";
import Inventory from "./inventory/inventory.js";
import Navigation from "./navigation/navigation.js";
import Checkout from "./checkout/checkout.js";
import Aggregate from "../lib/aggregate.js";

import { shoppingPageRequested } from "./navigation/navigation-messages.js";
import { checkoutWasRequested } from "./checkout/checkout-messages.js";
import { Logged } from "../lib/log.js";

const domain = Aggregate("shopping domain", [
    Cart(),
    ProductListing(),
    Inventory(),
    Navigation(),
    Checkout(),
    Outcome(),
    ConsoleLog("debug")
]);

domain(
    shoppingPageRequested,
    {
        cart: "modd-cart",
        productListing: "modd-product-listing"
    }
);

function Outcome() {
    return async function outcome(messageType, messageData) {
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
        "trace": 1,
        "debug": 2,
        "warn": 3,
        "error": 4
    };

    minLogLevel = logLevels[minLogLevel];

    return async function consoleLog(messageType, messageData) {
        if (messageType === Logged) {

            new Promise(() => {
                const { level, message, source } = messageData;
                const messageLogLevel = logLevels[level];
                if (minLogLevel > messageLogLevel) return;

                const messageDescription = message.map(x => {
                    try {
                        if (typeof x === "symbol") return x;
                        if (typeof x === "object") return "...";
                        return `${x}`;
                    } catch (err) {
                        return "?";
                    }
                });
                console.groupCollapsed(level.toUpperCase(), source, ":", ...messageDescription);
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
            });

        }

    };
}
