import { ensureStylesheet } from "../browser/elements.js";
import { itemWasAddedToCart } from "../cart/cart-messages.js";
import { ElementPort } from "../../lib/dom-adapter.js";
import { availableProductsDetermined } from "../inventory/inventory-messages.js";

ensureStylesheet(import.meta.url.replace(/\.js/, ".css"));

class MODDExampleProductListing extends HTMLElement {
    #items = [];
    #sendMessage;

    constructor() {
        super();
        this.render();
        this.registerEventListeners();
    }

    connectedCallback() {
        this.#sendMessage = ElementPort("product-listing-element", this, this.receive.bind(this));
    }

    disconnectedCallback() {
        this.#sendMessage.dispose();
    }

    receive(messageType, messageData) {
        if (messageType === availableProductsDetermined) {
            this.#items = messageData;
            this.render();
        }
    }

    registerEventListeners() {
        this.addEventListener("submit", e => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            this.#sendMessage(itemWasAddedToCart, data);
        });
    }

    render() {
        const items = this.#items;
        if (!items.length) {
            this.innerHTML = "items loading";
        } else {
            this.innerHTML = `<ul>
               ${items.map(renderItem).join("")}
            </ul>`;
        }
    }
}

function renderItem(item) {
    const canBuy = item.stockLevel > 0;
    return `<li>
        <img class="thumbnail" src="${item.imageUrl}" />
        <span class="title">${item.title}</span>
        <span class="author">${item.author}</span>

        <form>
            <input type="hidden" name="itemId" value="${item.listingId}" />
            <button ${canBuy ? "" : "disabled"}>Add to cart</button>
            <span class="stock-level">(${item.stockLevel} left)</span>
        </form>
    </li>`;
}

customElements.define("modd-product-listing", MODDExampleProductListing);