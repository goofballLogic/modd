import { SpawnContextPort } from "../lib/spawn-context-port.js";
import { availableProductsDetermined } from "./messages/inventory.js";
import { productListBehaviourRequested } from "./messages/product-listing.js";

export default function ProductListingElementPortSpawner() {

    /*
        When it receives a message that product list behaviour is requested,
        this entity will spawn a ContextPort entity which exchanges messages
        with the web component identified in the productListing element selector
        string.
    */
    return SpawnContextPort(
        productListBehaviourRequested,
        x => x.productListing,
        "product-listing-element",
        [availableProductsDetermined]
    );

}