import { SpawnContextPort } from "../entities/spawn-context-port.js";
import { availableProductsDetermined } from "../messages/inventory.js";
import { elementSelectorFromProductListBehaviourRequested, productListBehaviourRequested } from "../messages/product-listing.js";

export default () =>
    SpawnContextPort(
        productListBehaviourRequested,
        elementSelectorFromProductListBehaviourRequested,
        "product-listing-element",
        [availableProductsDetermined]
    );