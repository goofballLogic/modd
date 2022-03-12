import DOMDispatcher from "../../lib/dom-dispatcher.js";
import { ensureStylesheet } from "../browser/elements.js";
import { checkoutWasRequested } from "../checkout/checkout-messages.js";
import { cartBehaviourRequested, itemsInCartStatusUpdated, cart } from "./cart-messages.js";

ensureStylesheet(import.meta.url.replace(/\.js/, ".css"));

export const CartDispatcher = DOMDispatcher();

class MODDExampleCart extends HTMLElement {

    #items = new Set();
    #isEnabled = false;

    constructor() {
        super();
        CartDispatcher.register(this, this.receive.bind(this));
        this.attachHandlers();
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
                const existing = items.find(x => x.itemId === itemId);
                if (existing) {
                    existing.quantity = quantity;
                } else {
                    this.#items.add({ itemId, quantity, title });
                }
            }
            for (const item of this.#items) {
                if (!(item.itemId in messageData.items))
                    this.#items.delete(item);
            }
            this.render();
        }
    }

    attachHandlers() {
        this.addEventListener("submit", e => {
            const data = Object.fromEntries((new FormData(e.target)).entries());
            if (e.submitter && e.submitter.name) {
                data[e.submitter.name] = e.submitter.value;
            }
            switch (data.command) {
                case "clear":
                    e.preventDefault();
                    CartDispatcher.send(cart.lineItemCleared, { itemId: data.itemId });
                    break;
                case "reduce":
                    e.preventDefault();
                    CartDispatcher.send(cart.decreaseLineItemQuantity, { itemId: data.itemId });
            }
            if (e.target.classList.contains("checkout")) {
                e.preventDefault();
                CartDispatcher.send(cart.checkoutRequested);
            }
        });
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
    const decreaseEnabled = item.quantity > 1;
    return `
        <li>
            <form class="line-item">
                <input type="hidden" name="itemId" value="${item.itemId}" />
                <button name="command" value="clear">remove</button>
                <span class="quantity">${item.quantity ?? "?"}</span>
                <span class="title">${item.title ?? "?"}</span>
                <button name="command" value="reduce" ${decreaseEnabled ? "" : "disabled"}>
                    less
                </button>
            </form>
        </li>
    `;
}

function checkoutForm(canCheckout) {
    return `
        <form class="checkout">
            <button ${canCheckout ? "" : "disabled"}>Check out</button>
        </form>
    `;
}

customElements.define("modd-example-cart", MODDExampleCart);