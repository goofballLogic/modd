import Aggregate from "../../lib/aggregate.js";
import Forwarder from "../../lib/forwarder.js";
import { cartBehaviourRequested, cartUpdated, itemsInCartStatusUpdated, itemWasAddedToCart } from "./cart-messages.js";
import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import Collection from "./collection.js";
import "./modd-cart.js";
import { checkoutWasRequested } from "../checkout/checkout-messages.js";
import { ContextPort } from "../../lib/dom-adapter.js";
import Output from "../../lib/output.js";

export default function Cart() {

    return Output(send => {

        const forawrdCartUpdatedToParent = Forwarder("cart -> parent: cartUpdated", cartUpdated, send);

        const forwardItemsInCartStatusUpdatedToParent = Forwarder("cart -> parent: itemsInCartStatusUpdated", itemsInCartStatusUpdated, send);

        const forwardCheckoutWasRequestedToParent = Forwarder("cart -> parent: checkoutWasRequested", checkoutWasRequested, send);

        let context = null

        return async (messageType, messageData) => {

            switch (messageType) {
                case cartBehaviourRequested:
                    const cartWidget = ContextPort("cart-element", messageData.cart, (mt, md) => context(mt, md));
                    context = Aggregate("cart", [
                        Collection(),
                        cartWidget,
                        forawrdCartUpdatedToParent,
                        forwardItemsInCartStatusUpdatedToParent,
                        forwardCheckoutWasRequestedToParent
                    ])
                    await context(cartBehaviourRequested, { enabled: true })
                    break;
                case itemWasAddedToCart:
                    if (context)
                        await context(itemWasAddedToCart, messageData);
                    break;
                case availableProductsDetermined:
                    if (context)
                        await context(availableProductsDetermined, messageData);
                    break;
            }
        }
    });

}