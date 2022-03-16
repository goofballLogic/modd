import { ElementPort } from "../lib/dom-adapter.js";

class MODDTestsExampleElement extends HTMLElement {

    #port;

    constructor() {
        super();
        this.received = [];
    }

    connectedCallback() {
        this.#port = ElementPort(
            "example-element_" + this.id,
            this,
            (t, d) => this.receive(t, d)
        );
    }

    disconnectedCallback() {
        this.#port.dispose();
    }

    receive(messageType, messageData) {
        this.received.push([messageType, messageData]);
    }

    // test seam. Normally messages would be sent due to e.g. a user clicking a button
    sendAMessage(messageType, messageData) {
        return this.#port(messageType, messageData);
    }

}
customElements.define("modd-tests-example-element", MODDTestsExampleElement);
