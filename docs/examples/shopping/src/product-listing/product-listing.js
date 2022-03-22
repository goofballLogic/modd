import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import Aggregate from "../../lib/aggregate.js";
import { productListBehaviourRequested } from "./product-listing-messages.js";
import { itemWasAddedToCart } from "../cart/cart-messages.js";
import { ContextPort } from "../../lib/dom-adapter.js";
import "./modd-product-listing.js";
import Filter from "../../lib/filter.js";
import { Logged } from "../../lib/log.js";
import Context from "../../lib/context.js";
import TwoWay from "../../lib/outbound.js";

export default function ProductListing() {

    // given product listing selector and a send function, create and return the context port
    const productListingPort = elementSelector =>
        TwoWay(sendToAggregate =>
            Filter(availableProductsDetermined,
                ContextPort("product listing context", elementSelector, sendToAggregate)
            )
        );

    // given the message containing the product listing selector, build a two way containing the port
    const spawnProductListingPort = (_, messageData) => productListingPort(messageData.productListing);

    // the aggregate starts out with only an element which will spawn the product listing context port
    const contextAggregate = outside =>
        Aggregate(
            "product listing",
            [
                SpawnByMessage(productListBehaviourRequested, spawnProductListingPort),
                outside
            ]
        );

    return Context(
        "product listing",
        [productListBehaviourRequested, availableProductsDetermined],
        [itemWasAddedToCart, Logged],
        contextAggregate
    );

    function SpawnByMessage(activationMessageTypes, Factory) {
        return Filter(activationMessageTypes,
            (...args) => [
                [Factory(...args)]
            ]
        );
    }

}