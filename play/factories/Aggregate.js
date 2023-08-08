import { Observable } from "./Observable.js";

export function Aggregate(name, components, { ignoreNoReceivers = false } = {}) {

    const queue = [];

    let processingInbox = false;
    const self = message => {

        if(typeof message !== "function") {

            queue.push({ message, source: { id: "outside" } });
            ensureInboxIsProcessing();

        }

    }
    self.id = `Aggregate[${name}]`;
    setTimeout(initialiseComponents);
    return Observable(self);

    function initialiseComponents() {

        components.forEach(component => {

            const adapter = message => {

                queue.push({ message, source: component });
                ensureInboxIsProcessing();

            };
            adapter.id = self.id;
            component(adapter);

        });

    }

    async function ensureInboxIsProcessing() {

        if (processingInbox) return false;
        try {

            processingInbox = true;
            await processInboxMessagesUntilEmpty();

        } finally {

            processingInbox = false;

        }
        return true;

    }

    async function processInboxMessagesUntilEmpty() {

        while (queue.length) {

            if (queue.length > 100) throw new Error("Queue too large");
            const next = queue.shift();
            try {

                await processInboxMessage(next);

            } catch (err) {

                err.dead = next;
                throw err;

            }

        }

    }

    async function processInboxMessage({ source, message }) {

        if (!message) {

            console.warn("Invalid message", message, "from source", source?.id || source);
            return;

        }
        const applicable = components.filter(c => c !== source);
        if (!applicable.length) {

            if (!ignoreNoReceivers)
                console.warn("No receivers for message", message, "from", source?.id || source);
            return;

        }
        try {

            for (const component of applicable) {

                const results = await component({ sender: source.id, ...message });
                if (results) {

                    if (Array.isArray(results)) {

                        queue.push(...results.map(result => ({ message: result, source: component })));

                    } else {

                        queue.push({ message: results, source: component });

                    }

                }

            }

        } finally {

            ensureInboxIsProcessing();

        }

    }

}
