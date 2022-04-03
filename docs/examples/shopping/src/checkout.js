import Filter from "../lib/filter.js";
import MessageCache from "../lib/message-cache.js";
import { itemsInCartStatusUpdated } from "./messages/cart.js";
import { checkoutWasRequested } from "./messages/checkout.js";

const renderItem = ({ itemId, title, author, quantity }) => `
 - ${quantity} x item ${itemId}
   ${title}
   ${author}`;

const renderMessage = items => `
Welcome to the non-functional checkout! Your order:
${items}

We don't process orders so you will be returned to shopping. Buy more stuff.
`;

export default () =>
    MessageCache(
        itemsInCartStatusUpdated,
        Filter(
            checkoutWasRequested,
            async (_x, _y, messageCache) => {

                const items = messageCache[itemsInCartStatusUpdated]?.items
                    .map(renderItem)
                    .join("\n");
                const message = renderMessage(items);
                alert(message);

            }
        )
    );