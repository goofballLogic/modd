import { Logged } from "../entities/log.js";
import { cartUpdated } from "../messages/cart.js";
import { productListBehaviourRequested } from "../messages/product-listing.js";
import { availableProductsDetermined } from "../messages/inventory.js";
import ContextAggregate from "../entities/context-aggregate.js";
import AdaptInventory from "./inventory-adapt-inventory.js";
import FetchInventory from "./inventory-fetch-inventory.js";

export default () =>
    ContextAggregate({
        name: "inventory",
        inbound: [
            productListBehaviourRequested,
            cartUpdated
        ],
        outbound: [
            availableProductsDetermined,
            Logged
        ]
    }, [
        FetchInventory(),
        AdaptInventory()
    ]);