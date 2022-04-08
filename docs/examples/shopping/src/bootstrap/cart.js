import { cartBehaviourRequested, cartUpdated, itemsInCartStatusUpdated, itemWasAddedToCart } from "../messages/cart.js";
import { availableProductsDetermined } from "../messages/inventory.js";
import { checkoutWasRequested } from "../messages/checkout.js";
import { Logged } from "../entities/log.js";
import ContextAggregate from "../entities/context-aggregate.js";
import CartContent from "./cart-content.js";
import CartModeller from "./cart-modeller.js";
import CartElementPortSpawner from "./cart-element-port-spawner.js";

export default () =>
    ContextAggregate(
        {
            name: "cart context",
            inbound: [
                cartBehaviourRequested,
                itemWasAddedToCart,
                availableProductsDetermined
            ],
            outbound: [
                cartUpdated,
                itemsInCartStatusUpdated,
                checkoutWasRequested,
                Logged
            ]
        },
        [
            CartContent(),
            CartModeller(),
            CartElementPortSpawner()
        ]
    );