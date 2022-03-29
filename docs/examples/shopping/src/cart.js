import { cartBehaviourRequested, cartUpdated, itemWasAddedToCart } from "./messages/cart.js";
import { availableProductsDetermined } from "./messages/inventory.js";
import { checkoutWasRequested } from "./messages/checkout.js";
import { Logged } from "../lib/log.js";
import ContextAggregate from "../lib/context-aggregate.js";
import CartContent from "./cart-content.js";
import CartViewModeller from "./cart-view-modeller.js";
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
            CartViewModeller(),
            CartElementPortSpawner()
        ]
    );

}