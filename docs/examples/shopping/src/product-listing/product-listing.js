import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import { productListBehaviourRequested } from "./product-listing-messages.js";
import { itemWasAddedToCart } from "../cart/cart-messages.js";
import { ContextPort } from "../../lib/dom-adapter.js";
import "./modd-product-listing.js";
import { Logged } from "../../lib/log.js";
import Outbound from "../../lib/outbound.js";
import Spawn from "../../lib/spawn.js";
import ContextAggregate from "../../lib/context-aggregate.js";

export default function ProductListing() {

    /*
        When it receives a message that product list behaviour is requested,
        this entity will spawn a ContextPort entity which exchanges messages
        with the web component identified in the productListing element selector
        string.
    */
    const productListPortSpawner = Spawn(
        // message which triggers spawning
        productListBehaviourRequested,
        // transform on that message's data
        x => x.productListing,
        // factory to build the ContextPort connecting to the element
        elementSelector =>
            // it needs the ability to send outbound messages to the contextAggregate
            Outbound("product list context port outbound", contextAggregate =>

                ContextPort(
                    "product-listing-element",
                    elementSelector,
                    contextAggregate
                )

            )
    );

    return ContextAggregate(
        {
            name: "product listing",
            // we want to allow these messages into our context
            inbound: [
                productListBehaviourRequested,
                availableProductsDetermined
            ],
            // we want to allow these messages out of our context
            outbound: [
                itemWasAddedToCart,
                Logged
            ]
        },
        // the list of initial entities exchanging messages (until a entity is spawned)
        [
            productListPortSpawner
        ]
    );

}