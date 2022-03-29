import { cartBehaviourRequested, itemsInCartStatusUpdated } from "./messages/cart.js";
import { SpawnContextPort } from "../lib/spawn-context-port.js";

export default function CartElementPortSpawner() {

    return SpawnContextPort(
        cartBehaviourRequested,
        x => x.cart,
        "cart-element",
        [cartBehaviourRequested, itemsInCartStatusUpdated]
    );

}

