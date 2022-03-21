import { Logged } from "./log.js";

export default function Aggregate(aggregateName, components = []) {

    components = [...components];
    if (!components.every(x => x))
        throw Error("Non entity supplied in list of components");

    const backlog = [];
    let processingBacklog = false;

    const aggregate = async (...args) => {
        if (typeof args[0] === "function") {
            components.push(args[0]);
        } else {
            await processNormalMessage(...args);
        }
    };

    aggregate.id = aggregateName;

    send(aggregate);

    return aggregate;

    async function processNormalMessage(messageType, messageData) {
        if (messageType !== Logged) {
            backlog.push([Logged, {
                source: aggregateName,
                message: ["Received", messageType, new Error().stack],
                level: "trace"
            }]);
        }
        backlog.push([messageType, messageData]);
        if (!processingBacklog) {
            await processBacklog();
        }
    }

    async function processBacklog() {
        processingBacklog = true;
        let iterationCount = 0;
        try {
            while (backlog.length) {
                await processBacklogItem();
                if (++iterationCount > 1000) {
                    console.error(backlog);
                    throw new Error(`${aggregateName}: message loop stuck`);
                }
            }
        } finally {
            processingBacklog = false;
        }
    }

    async function processBacklogItem() {
        const [messageType, messageData] = backlog.shift();
        if (messageType !== Logged) {
            await logSent(messageType);
        }
        await send(messageType, messageData);
    }

    async function logSent(messageType) {
        await send(Logged, {
            source: aggregateName,
            message: [
                "Sent",
                messageType,
                `Remaining backlog size ${backlog.length}`
            ],
            level: messageType === Logged ? "logging" : "trace"
        });
    }

    async function send(messageType, messageData) {

        const snapshot = [...components];
        for (const component of snapshot) {

            await sendTo(component, messageType, messageData);

        }

    }

    async function sendTo(component, messageType, messageData) {

        const received = await component(messageType, messageData);
        if (Array.isArray(received)) {

            for (const [messageType, messageData] of received) {

                // invoke async method synchronously to allow event loop to drain
                aggregate(messageType, messageData);
            }

        }

    }
}