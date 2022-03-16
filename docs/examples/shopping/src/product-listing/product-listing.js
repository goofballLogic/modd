import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import Aggregate, { parentAggregateCreated } from "../../lib/aggregate.js";
import { productListBehaviourRequested } from "./product-listing-messages.js";
import { itemWasAddedToCart } from "../cart/cart-messages.js";
import Forwarder from "../../lib/forwarder.js";
import { ContextSidePort } from "../../lib/dom-adapter.js";
import "./modd-product-listing.js";

export default function ProductListing() {

    let parentAggregate;
    const forwardItemWasAddedToCartToParent = Forwarder(
        "product listing -> parent",
        itemWasAddedToCart,
        () => parentAggregate
    )

    let context;

    return async (messageType, messageData) => {
        switch (messageType) {
            case productListBehaviourRequested:
                const productListWidget = ContextSidePort("product listing", messageData.productListing, (mt, md) => context(mt, md));
                context = Aggregate("product listing", [
                    productListWidget,
                    forwardItemWasAddedToCartToParent
                ]);
                break;
            case availableProductsDetermined:
                if (context) {
                    await context(
                        availableProductsDetermined,
                        messageData
                    )
                }
                break;
            case parentAggregateCreated:
                parentAggregate = messageData;
                break;
        }
    }
}