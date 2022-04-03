import { availableProductsDetermined } from "./messages/inventory.js";
import { cartUpdated, itemsInCartStatusUpdated } from "./messages/cart.js";
import Merge from "../lib/merge.js";

function cartModel(data) {

    const cartUpdatedData = data[cartUpdated];
    const productList = data[availableProductsDetermined];
    const quantitiesByItemId = Object.entries(cartUpdatedData?.items || {});
    const items = quantitiesByItemId.map(
        ([itemId, quantity]) =>
        ({
            itemId,
            quantity,
            ...(productList.find(item => item.listingId === itemId) || {})
        })
    );
    return { items };

}

export default () => Merge({
    name: "Merge: items in cart",
    resetMessageType: availableProductsDetermined,
    accumulators: [availableProductsDetermined, cartUpdated],
    output: data => [
        [itemsInCartStatusUpdated, cartModel(data)]
    ]
});