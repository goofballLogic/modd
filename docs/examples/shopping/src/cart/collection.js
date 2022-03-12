import { cart, cartUpdated, itemWasAddedToCart, itemsInCartStatusUpdated } from "./cart-messages.js";

const clone = x => JSON.parse(JSON.stringify(x));

export default function Collection() {

    const items = new Map();
    const productLookup = new Map();

    return async (messageType, messageData) => {
        switch (messageType) {
            case itemWasAddedToCart:
                const { itemId } = messageData;
                console.log("Adding", itemId);
                const newCount = items.has(itemId) ? items.get(itemId) + 1 : 1;
                items.set(itemId, newCount);
                return [
                    buildCartUpdatedMessage(),
                    buildItemsInCartStatusUpdated()
                ];
            case cart.productList:
                for (const product of messageData) {
                    const { listingId, title } = product;
                    productLookup.set(listingId, { title });
                }
                break;
            default:
                return;
        }
    };

    function buildItemsInCartStatusUpdated() {
        const data = {};
        for (const [itemId, quantity] of items.entries()) {
            console.log(itemId, quantity);
            const product = productLookup.get(itemId);
            console.log(product, itemId, productLookup, productLookup.get(itemId));
            data[itemId] = { title: product?.title, quantity };
        }
        return [itemsInCartStatusUpdated, { items: data }];
    }

    function buildCartUpdatedMessage() {
        const data = Object.fromEntries(items.entries());
        return [cartUpdated, { items: data }];
    }
}