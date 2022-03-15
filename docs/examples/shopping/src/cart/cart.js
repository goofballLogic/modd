import Aggregate, { parentAggregateCreated } from "../../lib/aggregate.js";
import Forwarder from "../../lib/forwarder.js";
import { cart, cartBehaviourRequested, cartUpdated, itemsInCartStatusUpdated, itemWasAddedToCart } from "./cart-messages.js";
import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import Collection from "./collection.js";
import "./modd-cart.js";
import { checkoutWasRequested } from "../checkout/checkout-messages.js";
import { ContextSidePort } from "../../lib/dom-adapter.js";

export default function Cart() {

    let parentAggregate;

    const forawrdCartUpdatedToParent = Forwarder("cart -> parent: cartUpdated", cartUpdated, () => parentAggregate);

    const forwardItemsInCartStatusUpdatedToParent = Forwarder("cart -> parent: itemsInCartStatusUpdated", itemsInCartStatusUpdated, () => parentAggregate);

    const forwardCheckoutWasRequestedToParent = Forwarder("cart -> parent: checkoutWasRequested", checkoutWasRequested, () => parentAggregate);

    let context = null

    return async (messageType, messageData) => {
        switch (messageType) {
            case cartBehaviourRequested:
                const cartWidget = ContextSidePort("cart-element", messageData.cart, (mt, md) => context(mt, md));
                context = Aggregate("cart", [
                    Collection(),
                    cartWidget,
                    forawrdCartUpdatedToParent,
                    forwardItemsInCartStatusUpdatedToParent,
                    forwardCheckoutWasRequestedToParent
                ])
                await context(cartBehaviourRequested, { enabled: true })
                break;
            case parentAggregateCreated:
                parentAggregate = messageData;
                break;
            case itemWasAddedToCart:
                if (context)
                    await context(itemWasAddedToCart, asCartItem(messageData));
                break;
            case availableProductsDetermined:
                if (context)
                    await context(cart.productList, asCartProductList(messageData));
                break;
        }
    }
}

function asCartItem({ itemId }) {
    return { itemId };
}

function asCartProductList(messageData) {
    return JSON.parse(JSON.stringify(messageData));
}