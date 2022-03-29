import "./modd-cart.js";
import { cartBehaviourRequested, itemsInCartStatusUpdated } from "./cart-messages.js";
import { SpawnContextPort } from "../../lib/spawn-context-port.js";

export default function CartElementPortSpawner() {

    return SpawnContextPort(
        cartBehaviourRequested,
        x => x.cart,
        "cart-element",
        [cartBehaviourRequested, itemsInCartStatusUpdated]
    );

}

