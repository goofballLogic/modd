import { cartBehaviourRequested, elementSelectorFromCartBehaviourRequested, itemsInCartStatusUpdated } from "../messages/cart.js";
import { SpawnContextPort } from "../entities/spawn-context-port.js";

export default () =>
    SpawnContextPort(
        cartBehaviourRequested,
        elementSelectorFromCartBehaviourRequested,
        "cart-element",
        [
            cartBehaviourRequested,
            itemsInCartStatusUpdated
        ]
    );