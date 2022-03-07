import { ensureStylesheet } from "../browser/elements.js";

ensureStylesheet(import.meta.url.replace(/\.js/, ".css"));

class MODDExampleCart extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = "cart";
    }
}
customElements.define("modd-example-cart", MODDExampleCart);