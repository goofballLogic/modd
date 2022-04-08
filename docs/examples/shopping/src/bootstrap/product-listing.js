import { availableProductsDetermined } from "../messages/inventory.js";
import { productListBehaviourRequested } from "../messages/product-listing.js";
import { itemWasAddedToCart } from "../messages/cart.js";
import { Logged } from "../entities/log.js";
import ContextAggregate from "../entities/context-aggregate.js";
import ProductListElementPortSpawner from "./product-listing-element-port-spawner.js";

export default () =>
    ContextAggregate(
        {
            name: "product listing",
            inbound: [
                productListBehaviourRequested,
                availableProductsDetermined
            ],
            outbound: [
                itemWasAddedToCart,
                Logged
            ]
        },
        [
            ProductListElementPortSpawner()
        ]
    );