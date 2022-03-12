import { cartUpdated } from "../cart/cart-messages.js";
import { productListBehaviourRequested } from "../product-listing/product-listing-messages.js";
import { availableProductsDetermined } from "./inventory-messages.js";

export default function () {

    let inventory = null;

    return async (messageType, messageData) => {
        if (messageType === productListBehaviourRequested) {
            const inventory = await readInventory();
            return [[availableProductsDetermined, clone(inventory)]];
        }
        if (messageType === cartUpdated) {
            const availableInventory = await adaptInventory(messageData);
            return [[availableProductsDetermined, clone(availableInventory)]];
        }
    };

    function clone(x) {
        return JSON.parse(JSON.stringify(x));
    }

    async function adaptInventory({ items }) {
        const availableInventory = clone(await readInventory());
        for (const inventoryItem of availableInventory) {
            const inventoryId = inventoryItem.listingId;
            const cartCount = (inventoryId in items)
                ? items[inventoryId]
                : 0;
            inventoryItem.stockLevel = Math.max(
                0,
                inventoryItem.stockLevel - cartCount
            );
        }
        return availableInventory;
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
        }
        return inventory;
    }

}