import { productListBehaviourRequested } from "../product-listing/product-listing-messages.js";
import { availableProductsDetermined } from "./inventory-messages.js";

export default function () {

    let inventory = null;

    return async (messageType, _) => {
        if (messageType === productListBehaviourRequested) {
            const inventory = await readInventory();
            const message = [availableProductsDetermined, clone(inventory)];
            return [message];
        }
    };

    function clone(x) {
        return JSON.parse(JSON.stringify(x));
    }

    async function readInventory() {
        if (!inventory) {
            const parts = import.meta.url.split("/");
            parts.pop();
            parts.push("fake-catalog.json");
            const url = new URL(parts.join("/"));
            const resp = await fetch(url);
            const data = await resp.json();
            inventory = data.items;
            for (const item of inventory) {
                item.stockLevel = 3;
            }
        }
        return inventory;
    }

}