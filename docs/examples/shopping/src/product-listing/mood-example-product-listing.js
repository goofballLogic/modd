document.addEventListener("DOMContentLoaded", () => {
    const link = document.createElement("LINK");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", import.meta.url.replace(/\.js/, ".css"));
    document.head.appendChild(link);
});

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