import { ensureStylesheet } from "../../entities/elements.js";
import { ElementPort } from "../../entities/dom-adapter.js";
import Aggregate from "../../entities/aggregate.js";
import {
    cartBehaviourRequested,
    itemWasRemovedFromCart,
    itemQuantityWasChanged,
    itemsInCartStatusUpdated
} from "../../messages/cart.js";
import { checkoutWasRequested } from "../../messages/checkout.js";
import { ElementReaction } from "../../entities/dom-element-reaction.js";
import { SwitchableElementReaction } from "../../entities/dom-switchable-element-reaction.js";
import Filter from "../../entities/filter.js";

ensureStylesheet(import.meta.url.replace(/\.js/, ".css"));

const renderMessage = Symbol("Cart: render");

const Header = ElementReaction(
    {
        name: "cart-header",
        calculateHash: (_, data) => (data?.items?.length || 0),
        mutate: (_, data, header) => {
            const count = data?.items?.length || 0;
            header.querySelector(".total-count").innerHTML = count;
        }
    },
    `<header class="toggler">Cart <span class="total-count">0</span></header>`
);

const Checkout = ElementReaction(
    {
        name: "cart-checkout",
        calculateHash: (_, data) => !!(data?.canCheckout),
        mutate: (_, data, form) => {
            form.querySelector("button").disabled = !(data?.canCheckout)
        }
    },
    `<form class="checkout"><button disabled>Check out</button>`
);

const Items = (() => {

    return SwitchableElementReaction(
        {
            name: "cart-items",
            selectElement: (_, messageData, emptyElement, populatedElement) =>
                messageData?.items?.length ? populatedElement : emptyElement,
            calculateHash: (_, messageData) => JSON.stringify([
                !!(messageData?.items?.length),
                (messageData?.items || []).map(x => x.quantity).join(",")
            ]),
            mutate: (_, messageData, selectedElement) => {
                if (messageData?.items?.length)
                    selectedElement.innerHTML =
                        messageData.items.map(renderItem).join("");
            }
        },
        `
            <span class="empty-message" > Nothing in cart</span>
            <ul></ul>
        `
    );

})();

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

    #renderer = renderer(this);

    async render(viewModel) {
        const items = viewModel?.items || [];
        const hasItems = !!items.length;
        const canCheckout = hasItems && this.#isEnabled;
        this.#renderer({ items, hasItems, canCheckout });
    }
}

let domListCount = 1;
function DOMList(
    {
        name,
        container,
        allowedMessages,
        selectEntries,
        childFactory
    } = {}
) {
    name = name || `DOMList ${domListCount++} `;
    return Aggregate(
        name,
        [
            Filter(
                allowedMessages,
                function X() {

                    const elementsWhichExist = [];
                    return async (messageType, messageData) => {

                        const output = [];
                        const entries = await selectEntries(messageType, messageData);
                        if (entries && entries.length) {

                            const entryIds = entries.map(([id]) => id);
                            console.log(entries, entryIds);
                            // which entries are missing?
                            const missingIds = entryIds.filter(id => !elementsWhichExist.includes(id));
                            console.log("Missing:", missingIds);
                            // create missing ones
                            for (const id of missingIds) {

                                const newChild = childFactory({ container, id });
                                await newChild(messageType, messageData);
                                output.push([newChild]);
                                elementsWhichExist.push(id);

                            }

                        }
                        return output;

                    }

                }()
            ),
            console.warn.bind(console, name)
        ]
    );

}

function DOMListItem({
    name,
    container,
    id
}, html) {

    return async (messageType, messageData) => {

        console.error(name, id, messageType, messageData);

    };

}

function renderer(container) {

    const header = Header(container);
    const items = Items(container);
    const checkout = Checkout(container);

    const items2 = DOMList({
        name: "cart-items (2)",
        allowedMessages: renderMessage,
        container,
        selectEntries: (_, data) => (data?.items || []).map(x => [x.itemId, x]),
        childFactory: DOMListItem({ container }, "<div>hello</div>")
    });
    return async messageData => await Promise.allSettled([
        header(null, messageData),
        items(null, messageData),
        checkout(null, messageData),
        items2(renderMessage, messageData)
    ]);

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
        </li >
    `;
}


customElements.define("modd-cart", MODDExampleCart);