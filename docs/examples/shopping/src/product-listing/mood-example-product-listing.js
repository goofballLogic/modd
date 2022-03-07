import { parentAggregateCreated } from "../../lib/aggregate.js";
import { ensureStylesheet } from "../browser/elements.js";

ensureStylesheet(import.meta.url.replace(/\.js/, ".css"));

class MODDExampleProductListing extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = "product-listing";
    }
}

customElements.define("modd-example-product-listing", MODDExampleProductListing);