import { ensureStylesheet } from "../../lib/elements.js";
import {
    cartBehaviourRequested,
    itemWasRemovedFromCart,
    itemQuantityWasChanged,
    itemsInCartStatusUpdated
} from "../messages/cart.js";
import { ElementPort } from "../../lib/dom-adapter.js";
import { checkoutWasRequested } from "../messages/checkout.js";

ensureStylesheet(import.meta.url.replace(/\.js/, ".css"));

class MODDExampleCart extends HTMLElement {

    #isEnabled = false;
    #collapsed = true;
    #sendMessage;

    constructor() {
        super();
        this.attachHandlers();
        this.classList.add("collapsed");
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
            this.#isEnabled = true;
            this.render();
        }
        if (messageType === itemsInCartStatusUpdated) {
            this.render(messageData);
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
                this.#sendMessage(checkoutWasRequested);
            }
        });
        this.addEventListener("click", e => {
            if (e.target.classList.contains("toggler")) {
                this.#collapsed = !this.#collapsed;
                if (this.#collapsed) {
                    this.classList.add("collapsed");
                } else {
                    this.classList.remove("collapsed");
                }
            }
        })
    }

    render(viewModel) {

        const items = viewModel?.items || [];
        const hasItems = !!items.length;
        const canCheckout = hasItems && this.#isEnabled;
        this.innerHTML = `
            <header class="toggler">
                Cart
                <span class="total-count">${items.length}</span>
            </header>
            ${hasItems ? renderItems(items) : renderEmpty()}
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