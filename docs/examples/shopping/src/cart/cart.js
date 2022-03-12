import Aggregate, { parentAggregateCreated } from "../../lib/aggregate.js";
import Forwarder from "../../lib/forwarder.js";
import { cart, cartBehaviourRequested, cartUpdated, itemsInCartStatusUpdated, itemWasAddedToCart } from "./cart-messages.js";
import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import Collection from "./collection.js";
import "./mood-example-cart.js";
import { CartDispatcher } from "./mood-example-cart.js";
import Transformer from "../../lib/transformer.js";

const clone = x => JSON.parse(JSON.stringify(x));
const reduceEntries = (obj, key) => Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v[key]])
);

export default function Cart() {

    let parentAggregate;

    const forawrdCartUpdatedToParent = Forwarder("cart -> parent: cartUpdated", cartUpdated, () => parentAggregate);

    const forwardItemsInCartStatusUpdatedToParent = Forwarder("cart -> parent: itemsInCartStatusUpdated", itemsInCartStatusUpdated, () => parentAggregate);

    const context = Aggregate("cart", [
        CartDispatcher,
        Collection(),
        forawrdCartUpdatedToParent,
        forwardItemsInCartStatusUpdatedToParent
    ]);

    return async (messageType, messageData) => {
        switch (messageType) {
            case cartBehaviourRequested:
                await context(cartBehaviourRequested, { enabled: true })
                break;
            case parentAggregateCreated:
                parentAggregate = messageData;
                break;
            case itemWasAddedToCart:
                await context(itemWasAddedToCart, asCartItem(messageData));
                break;
            case availableProductsDetermined:
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