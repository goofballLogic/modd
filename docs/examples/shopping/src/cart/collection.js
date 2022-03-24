import { checkoutWasRequested } from "../checkout/checkout-messages.js";
import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import { cart, cartUpdated, itemWasAddedToCart, itemsInCartStatusUpdated, itemWasRemovedFromCart, itemQuantityWasChanged } from "./cart-messages.js";

/*
    This entity has a few responsibiliies.
    1. Firsly, when it receives a message that available products have been determined,
        it updates its internal record of what products there are
    2. Secondly, if an item is added, removed, or its quantity is changed, it keeps a
        record of the tally of items in the cart
    3. Finally, when adjustments are made to the items in the cart, it sends out a consolidated
        update of the needed product details and quantity for the user to interact with
*/
export default function Collection() {

    const items = new Map();
    const productLookup = new Map();

    return async (messageType, messageData) => {
        switch (messageType) {
            case itemWasAddedToCart:
                return addItemToCart(messageData);
            case availableProductsDetermined:
                storeProductDefinitions(messageData);
                break;
            case itemWasRemovedFromCart:
                return clearLineItem(messageData);
            case itemQuantityWasChanged:
                return setLineItemQuantity(messageData);
            case cart.checkoutRequested:
                return buildCheckoutRequested();
        }
    };

    function storeProductDefinitions(messageData) {
        for (const product of messageData) {
            const { listingId, title } = product;
            productLookup.set(listingId, { title });
        }
    }

    function setLineItemQuantity(data) {
        const { itemId, quantity } = data;
        if (items.has(itemId)) {
            items.set(itemId, quantity);
            return buildMessagesAfterCartUpdated();
        }
    }

    function clearLineItem(data) {
        const { itemId } = data;
        items.delete(itemId);
        return buildMessagesAfterCartUpdated();
    }

    function addItemToCart(data) {
        const { itemId } = data;
        const newCount = items.has(itemId) ? items.get(itemId) + 1 : 1;
        items.set(itemId, newCount);
        return buildMessagesAfterCartUpdated()
    }

    /* message builders */

    function buildCheckoutRequested() {
        const data = Object.fromEntries(
            items.entries()
        );
        return [
            [checkoutWasRequested, { items: data }]
        ];
    }

    function buildMessagesAfterCartUpdated() {
        return [];
        return [
            buildCartUpdatedMessage(),
            buildItemsInCartStatusUpdated()
        ];
    }

    function buildItemsInCartStatusUpdated() {
        const data = {};
        for (const [itemId, quantity] of items.entries()) {
            const product = productLookup.get(itemId);
            data[itemId] = { title: product?.title, quantity };
        }
        return [itemsInCartStatusUpdated, { items: data }];
    }

    function buildCartUpdatedMessage() {
        const data = Object.fromEntries(items.entries());
        return [cartUpdated, { items: data }];
    }
}