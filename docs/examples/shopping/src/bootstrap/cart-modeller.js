import { availableProductsDetermined } from "../messages/inventory.js";
import { cartUpdated, buildItemsInCartStatusUpdated } from "../messages/cart.js";
import Merge from "../entities/merge.js";

export default () =>
    Merge({
        name: "Merge: items in cart",
        resetMessageType: availableProductsDetermined,
        accumulators: [availableProductsDetermined, cartUpdated],
        output: data => [
            buildItemsInCartStatusUpdated(
                data[cartUpdated],
                data[availableProductsDetermined]
            )
        ]
    });