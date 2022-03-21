import { ensureStylesheet } from "../browser/elements.js";
import {
    cartBehaviourRequested,
    itemsInCartStatusUpdated,
    cart,
    itemWasRemovedFromCart,
    itemQuantityWasChanged
} from "./cart-messages.js";
import { ElementPort } from "../../lib/dom-adapter.js";

ensureStylesheet(import.meta.url.replace(/\.js/, ".css"));

class MODDExampleCart extends HTMLElement {

    #items = new Set();
    #isEnabled = false;
    #collapsed = true;
    #sendMessage;

    constructor() {
        super();
        this.attachHandlers();
        this.render();
    }

    connectedCallback() {
        this.#sendMessage = ElementPort("cart", this, this.receive.bind(this));
    }

    disconnectedCallback() {
        this.#sendMessage.dispose();
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
                    this.#sendMessage(itemWasRemovedFromCart, { itemId: data.itemId });
                    break;
                case "set-quantity":
                    e.preventDefault();
                    const newQuantity = Number(data.newQuantity || "0");
                    this.#sendMessage(itemQuantityWasChanged, { itemId: data.itemId, quantity: newQuantity });
                    break;
            }
            if (e.target.classList.contains("checkout")) {
                e.preventDefault();
                this.#sendMessage(cart.checkoutRequested);
            }
        });
        this.addEventListener("click", e => {
            if (e.target.classList.contains("toggler")) {
                this.#collapsed = !this.#collapsed;
                this.render();
            }
        })
    }

    render() {

        if (this.#collapsed && !this.classList.contains("collapsed")) {
            this.classList.add("collapsed");
        }
        if (!this.#collapsed && this.classList.contains("collapsed")) {
            this.classList.remove("collapsed");
        }
        const hasItems = !!this.#items.size
        const canCheckout = hasItems && this.#isEnabled;
        this.innerHTML = `
            <header class="toggler">Cart <span class="total-count">${countItems(this.#items)}</span></header>
            ${hasItems ? renderItems(this.#items) : renderEmpty()}
            ${checkoutForm(canCheckout)}
        `;
    }
}

function countItems(items) {
    return Array.from(items).reduce((sum, i) => sum + i.quantity, 0);
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
                <input type="hidden" name="newQuantity" value="${item.quantity ? item.quantity - 1 : 0}" />
                <button name="command" value="set-quantity" ${decreaseEnabled ? "" : "disabled"}>
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

customElements.define("modd-cart", MODDExampleCart);