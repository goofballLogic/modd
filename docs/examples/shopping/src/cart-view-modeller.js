import { availableProductsDetermined } from "./messages/inventory.js";
import { cartUpdated, itemsInCartStatusUpdated } from "./messages/cart.js";
import Merge from "../lib/merge.js";

export default function CartViewModeller() {

    function buildViewModel(cache) {

        const cartUpdatedData = cache[cartUpdated];
        const productList = cache[availableProductsDetermined];
        const quantitiesByItemId = Object.entries(cartUpdatedData?.items || {});
        const items = quantitiesByItemId.map(
            ([itemId, quantity]) =>
            ({
                itemId,
                quantity,
                title: productList.find(item => item.listingId === itemId)?.title || "?"
            })
        );
        return { items };

    }

    return Merge({
        name: "Merge: items in cart",
        resetMessageType: availableProductsDetermined,
        accumulators: [availableProductsDetermined, cartUpdated],
        output: cache => [
            [itemsInCartStatusUpdated, buildViewModel(cache)]
        ]
    });
}
