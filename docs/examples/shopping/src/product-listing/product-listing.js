import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import Aggregate from "../../lib/aggregate.js";
import { productListBehaviourRequested } from "./product-listing-messages.js";
import { itemWasAddedToCart } from "../cart/cart-messages.js";
import Forwarder from "../../lib/forwarder.js";
import { ContextPort } from "../../lib/dom-adapter.js";
import "./modd-product-listing.js";
import Output from "../../lib/output.js";

export default function ProductListing() {

    return Output(send => {

        const forwardItemWasAddedToCartToParent = Forwarder(
            "product listing -> parent",
            itemWasAddedToCart,
            send
        )

        let context;

        return async (messageType, messageData) => {
            switch (messageType) {
                case productListBehaviourRequested:
                    const productListWidget = ContextPort("product listing", messageData.productListing, (mt, md) => context(mt, md));
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
            }
        }

    });

}