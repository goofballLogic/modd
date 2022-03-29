import { cartBehaviourRequested, cartUpdated, itemWasAddedToCart } from "./cart-messages.js";
import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import { checkoutWasRequested } from "../checkout/checkout-messages.js";
import { Logged } from "../../lib/log.js";
import ContextAggregate from "../../lib/context-aggregate.js";
import CartContent from "./cart-content.js";
import ViewModeller from "./view-modeller.js";
import CartElementPortSpawner from "./cart-element-port-spawner.js";

export default function Cart() {

    return ContextAggregate(
        {
            name: "cart context",
            inbound: [
                cartBehaviourRequested,
                itemWasAddedToCart,
                availableProductsDetermined
            ],
            outbound: [
                cartUpdated,
                checkoutWasRequested,
                Logged
            ]
        },
        [
            CartContent(),
            ViewModeller(),
            CartElementPortSpawner()
        ]
    );

}