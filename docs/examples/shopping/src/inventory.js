import { Logged } from "../lib/log.js";
import FetchResource from "../lib/fetch-resource.js";
import { cartUpdated } from "./messages/cart.js";
import { productListBehaviourRequested } from "./messages/product-listing.js";
import { mergeAvailableProductsAndCartUpdated, availableProductsDetermined } from "./messages/inventory.js";
import ContextAggregate from "../lib/context-aggregate.js";
import Merge from "../lib/merge.js";

const inventoryRoute = (function () {
    const parts = import.meta.url.split("/");
    parts.pop();
    parts.push("inventory-fake-catalog.json");
    return new URL(parts.join("/"));
}());

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
        FetchResource({
            name: "fetch inventory",
            fetchMessageType: productListBehaviourRequested,
            urlBuilder: () => inventoryRoute,
            outputMessageType: availableProductsDetermined,
            outputMessageTransform: x => x.items
        }),
        Merge({
            name: "adapt inventory",
            accumulators: [availableProductsDetermined, cartUpdated],
            output: cache => mergeAvailableProductsAndCartUpdated(
                cache[availableProductsDetermined] || [],
                cache[cartUpdated]?.items || {}
            )
        })
    ]);