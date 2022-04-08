import { cartUpdated } from "../messages/cart.js";
import { mergeAvailableProductsAndCartUpdated, availableProductsDetermined } from "../messages/inventory.js";
import Merge from "../entities/merge.js";

export default () =>
    Merge({
        name: "adapt inventory",
        accumulators: [availableProductsDetermined, cartUpdated],
        output: cache => [
            mergeAvailableProductsAndCartUpdated(
                cache[availableProductsDetermined] || [],
                cache[cartUpdated]?.items || {}
            )
        ]
    });