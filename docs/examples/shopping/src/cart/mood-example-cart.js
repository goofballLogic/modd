import DOMDispatcher from "../../lib/dom-dispatcher.js";
import { ensureStylesheet } from "../browser/elements.js";
import { cartBehaviourRequested, itemsInCartStatusUpdated } from "./cart-messages.js";

ensureStylesheet(import.meta.url.replace(/\.js/, ".css"));

export const CartDispatcher = DOMDispatcher();

class MODDExampleCart extends HTMLElement {

    #items = new Set();
    #isEnabled = false;

    constructor() {
        super();
        CartDispatcher.register(this, this.receive.bind(this));
        this.render();
    }

    receive(messageType, messageData) {
        if (messageType === cartBehaviourRequested) {
            this.#isEnabled = !!messageData?.enabled;
            this.render();
        }
        if (messageType === itemsInCartStatusUpdated) {
            const items = Array.from(this.#items);
            for (const [itemId, { title, quantity }] of Object.entries(messageData.items)) {
                console.log(itemId, quantity);
                const existing = items.find(x => x.itemId === itemId);
                if (existing) {
                    existing.quantity = quantity;
                } else {
                    this.#items.add({ itemId, quantity, title });
                }
            }
            this.render();
        }
    }

    render() {

        const hasItems = !!this.#items.size
        const canCheckout = hasItems && this.#isEnabled;
        this.innerHTML = `
            <header>Cart</header>
            ${hasItems ? renderItems(this.#items) : renderEmpty()}
            ${checkoutForm(canCheckout)}
        `;
    }
}

function renderEmpty() {
    return `
        <span class="empty-message">Nothing in cart</span>
    `;
}

function renderItems(items) {
    items = Array.from(items);
    return `
        <ul>${items.map(renderItem).join("")}</ul>
    `;
}

function renderItem(item) {
    return `
        <li>
            <span class="quantity">${item.quantity ?? "?"}</span>
            <span class="title">${item.title ?? "?"}</span>
        </li>
    `;
}

function checkoutForm(canCheckout) {
    return `
        <form>
            <button ${canCheckout ? "" : "disabled"}>Check out</button>
        </form>
    `;
}

customElements.define("modd-example-cart", MODDExampleCart);