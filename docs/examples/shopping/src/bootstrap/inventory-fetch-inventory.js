import FetchResource from "../entities/fetch-resource.js";
import { productListBehaviourRequested } from "../messages/product-listing.js";
import { availableProductsDetermined } from "../messages/inventory.js";

const inventoryRoute = (function () {
    const parts = import.meta.url.split("/");
    parts.pop();
    parts.push("inventory-fake-catalog.json");
    return new URL(parts.join("/"));
}());

export default () =>
    FetchResource({
        name: "fetch inventory",
        fetchMessageType: productListBehaviourRequested,
        url: inventoryRoute,
        outputMessageType: availableProductsDetermined,
        outputMessageTransform: x => x.items
    });