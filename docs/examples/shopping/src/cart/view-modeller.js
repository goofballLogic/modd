import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import { cartUpdated, itemsInCartStatusUpdated } from "./cart-messages.js";
import Merge from "../../lib/merge.js";

export default function ViewModeller() {

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
