import DOMDispatcher from "../../lib/dom-dispatcher.js";
import { ensureStylesheet } from "../browser/elements.js";
import { productListing } from "./product-listing-messages.js";
import { itemWasAddedToCart } from "../cart/cart-messages.js";

ensureStylesheet(import.meta.url.replace(/\.js/, ".css"));

export const ProductListingDispatcher = DOMDispatcher();

class MODDExampleProductListing extends HTMLElement {
    #items = [];

    constructor() {
        super();
        this.render();
        this.registerEventListeners();
        ProductListingDispatcher.register(this, (mt, md) => this.receive(mt, md));
    }

    receive(messageType, messageData) {
        if (messageType === productListing.availableProductsDetermined) {
            this.#items = messageData;
            this.render();
        }
    }

    registerEventListeners() {
        this.addEventListener("submit", e => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            ProductListingDispatcher.send(itemWasAddedToCart, data);
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