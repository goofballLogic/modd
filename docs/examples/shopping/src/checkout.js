import Filter from "../lib/filter.js";
import MessageCache from "../lib/message-cache.js";
import { cartUpdated } from "./messages/cart.js";
import { checkoutWasRequested } from "./messages/checkout.js";
import { availableProductsDetermined } from "./messages/inventory.js";

function buildViewModel(cache) {

    const cartUpdatedData = cache[cartUpdated];
    const productList = cache[availableProductsDetermined];
    const quantitiesByItemId = Object.entries(cartUpdatedData?.items || {});
    const items = quantitiesByItemId.map(
        ([itemId, quantity]) =>
        ({
            itemId,
            quantity,
            ...productList.find(item => item.listingId === itemId)
        })
    );
    return { items };

}

const renderItem = ({ itemId, title, author, quantity }) => `
 - ${quantity} x item ${itemId}
   ${title}
   ${author}`;

const renderMessage = items => `
Welcome to the non-functional checkout! Your order:
${items}

We don't process orders so you will be returned to shopping. Buy more stuff.`;

export default function Checkout() {

    return MessageCache([
        cartUpdated,
        availableProductsDetermined
    ], Filter(
        checkoutWasRequested,
        async (_x, _y, messageCache) => {

            const items = buildViewModel(messageCache).items.map(renderItem).join("\n");
            const message = renderMessage(items);
            alert(message);

        })
    );

}