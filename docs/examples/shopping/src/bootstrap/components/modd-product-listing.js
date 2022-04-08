import { ensureStylesheet } from "../../entities/elements.js";
import { itemWasAddedToCart } from "../../messages/cart.js";
import { ElementPort } from "../../entities/dom-adapter.js";
import { availableProductsDetermined } from "../../messages/inventory.js";

ensureStylesheet(import.meta.url.replace(/\.js/, ".css"));

class MODDExampleProductListing extends HTMLElement {
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
            setTimeout(() => this.render(messageData));
        }
    }

    registerEventListeners() {
        this.addEventListener("submit", e => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            this.#sendMessage(itemWasAddedToCart, data);
        });
    }

    render(items = []) {
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
        <img class="thumbnail" alt="book cover" src="${item.imageUrl}" />
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