import { Logged } from "../lib/log.js";
import { cartUpdated } from "./messages/cart.js";
import { productListBehaviourRequested } from "./messages/product-listing.js";
import { availableProductsDetermined } from "./messages/inventory.js";

const clone = x => JSON.parse(JSON.stringify(x));

export default function Inventory() {

    let inventory = null;

    return async (messageType, messageData) => {
        if (messageType === productListBehaviourRequested) {
            const inventory = await readInventory();
            return [[availableProductsDetermined, clone(inventory)]];
        }
        if (messageType === cartUpdated) {
            const logged = [];
            const availableInventory = await adaptInventory(messageData, logged.push.bind(logged));
            return [
                [availableProductsDetermined, clone(availableInventory)],
                ...logged.map(x => [Logged, x])
            ];
        }
    };

    async function adaptInventory({ items }, log) {

        const availableInventory = await readInventory();
        for (const inventoryItem of availableInventory) {
            const inventoryId = inventoryItem.listingId;
            if (inventoryId in items) {
                const cartCount = items[inventoryId];
                log({
                    source: "Inventory",
                    message: [`${inventoryItem.listingId} drawn down by ${cartCount}`],
                    level: "debug"
                });
                inventoryItem.stockLevel = Math.max(
                    0,
                    inventoryItem.stockLevel - cartCount
                );
            }
        }
        return availableInventory;
    }

    async function readInventory() {
        if (!inventory) {
            const data = await fetchInventoryData();
            inventory = data.items;
        }
        return clone(inventory);
    }

}

async function fetchInventoryData() {
    const parts = import.meta.url.split("/");
    parts.pop();
    parts.push("inventory-fake-catalog.json");
    const url = new URL(parts.join("/"));
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
}
