import { itemsInCartStatusUpdated } from "../messages/cart.js";

export const renderItem = ({ itemId, title, author, quantity }) =>
    `
 - ${quantity} x item ${itemId}
   ${title}
   ${author}
`;

export const renderMessage = items =>
    `
Welcome to the non-functional checkout! Your order:
${items}

We don't process orders so you will be returned to shopping. Buy more stuff.
`;


export default () =>
    (_x, _y, messageCache) => {

        const items = messageCache[itemsInCartStatusUpdated]?.items
            .map(renderItem)
            .join("\n");
        const message = renderMessage(items);
        alert(message);

    };
