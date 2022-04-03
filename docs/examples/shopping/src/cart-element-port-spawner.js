import { cartBehaviourRequested, itemsInCartStatusUpdated } from "./messages/cart.js";
import { SpawnContextPort } from "../lib/spawn-context-port.js";

export default () => SpawnContextPort(
    cartBehaviourRequested,
    x => x.cart,
    "cart-element",
    [cartBehaviourRequested, itemsInCartStatusUpdated]
);