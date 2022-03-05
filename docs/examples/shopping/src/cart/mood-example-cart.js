document.addEventListener("DOMContentLoaded", () => {
    const link = document.createElement("LINK");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", import.meta.url.replace(/\.js/, ".css"));
    document.head.appendChild(link);
});

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