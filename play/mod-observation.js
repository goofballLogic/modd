import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10.3.0/+esm'

class Observation extends HTMLElement {

    #registered = [];
    #inbound = [];

    constructor() {
        super();
        mermaid.initialize();
    }

    connectedCallback() {
        this.registerEvents();
    }

    registerEvents() {
        this.registerEvent(this.getAttribute("registration"), this.handleRegistration.bind(this));
        this.registerEvent(this.getAttribute("inbound"), this.handleInbound.bind(this));
    }

    registerEvent(attr, handler) {
        if (attr) document.addEventListener(attr, handler);
    }

    handleRegistration(e) {
        this.#registered.push({
            ...e.detail,
            alias: `E${e.detail.id.replace(/\W/g, "_")}`
        });
        this.render();
    }

    handleInbound(e) {
        const record = { ...e.detail };
        this.#inbound.push(record);
        const { message, id, when } = record;
        const receiver = this.#registered.find(r => r.id === id);
        record.receiver = receiver;

        if(typeof message === "function") {

            if(e.detail.message.id && id) {

                // connection between two objects
                const outside = this.#registered.find(r => r.id === message.id);
                receiver.outside = outside;
                this.render();

            }

        } else {

            const sender = this.#registered.find(r => r.id === message.sender);
            if(sender) {

                record.sender = sender;
                this.render();

            } else {

                console.log(message);

            }

        }

    }

    #renderTimeout;
    #mermaidDiv;
    #nodesDiagramDiv;

    async render() {


        if(!this.#mermaidDiv) {

            this.#mermaidDiv = document.createElement("DIV");
            this.#mermaidDiv.id = "nodes" + (Date.now() * Math.random()).toString().replace("\.", "_");
            this.appendChild(this.#mermaidDiv);

        }
        if(!this.#nodesDiagramDiv) {

            this.#nodesDiagramDiv = document.createElement("DIV");
            this.appendChild(this.#nodesDiagramDiv);

        }
        if (this.#renderTimeout) clearTimeout(this.#renderTimeout);
        this.#renderTimeout = setTimeout(async () => {

            this.#renderTimeout = null;
            const messageExchanges = new Set(
                this.#inbound
                    .filter(r => r.receiver && r.sender)
                    .map(r => `${r.sender.alias}-.${r.message.type?.description || ""}.->${r.receiver.alias};`)
            );
            const graphDefinition = `
                graph LR
                ${this.#registered.map(r => `
                    ${r.alias}["${r.id}"];
                `).join("\n")}
                ${this.#registered.filter(r => r.outside).map(r => `
                    ${r.outside.alias}---${r.alias};
                `).join("\n")}
                ${Array.from(messageExchanges).join("\n")}
            `;

            // render svg
            const { svg } = await mermaid.render(this.#mermaidDiv.id, graphDefinition);

            // add svg
            this.#nodesDiagramDiv.innerHTML = svg;

        }, 10);

    }

}

customElements.define("mod-observation", Observation);
