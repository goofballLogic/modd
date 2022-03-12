import { checkoutWasRequested } from "../checkout/checkout-messages.js";
import { cart, cartUpdated, itemWasAddedToCart, itemsInCartStatusUpdated } from "./cart-messages.js";

const clone = x => JSON.parse(JSON.stringify(x));

export default function Collection() {

    const items = new Map();
    const productLookup = new Map();

    return async (messageType, messageData) => {
        switch (messageType) {
            case itemWasAddedToCart:
                return addItemToCart(messageData);
            case cart.productList:
                storeProductDefinitions(messageData);
                break;
            case cart.lineItemCleared:
                return clearLineItem(messageData);
            case cart.decreaseLineItemQuantity:
                return decreaseLineItemQuantity(messageData);
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

    function decreaseLineItemQuantity(data) {
        const { itemId } = data;
        if (items.has(itemId)) {
            const count = items.get(itemId);
            if (count > 1) {
                items.set(itemId, count - 1);
                return buildMessagesAfterCartUpdated();
            }
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

    function buildCheckoutRequested() {
        const data = Object.fromEntries(
            items.entries()
        );
        return [
            [checkoutWasRequested, { items: data }]
        ];
    }

    function buildMessagesAfterCartUpdated() {
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