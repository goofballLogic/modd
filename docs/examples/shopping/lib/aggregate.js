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
        backlog.push([messageType, messageData]);
        if (!processingBacklog) {
            await processBacklog();
        }
    }

    async function processBacklog() {
        processingBacklog = true;
        try {
            while (backlog.length) {
                await processBacklogItem();
            }
        } finally {
            processingBacklog = false;
        }
    }

    async function processBacklogItem() {
        const [messageType, messageData] = backlog.shift();
        await send(messageType, messageData);
        if (messageType !== Logged) {
            await logSent(messageType);
        }
    }

    async function logSent(messageType) {
        await send(Logged, {
            source: aggregateName,
            message: [
                `Sent ${messageType?.description}`,
                `Remaining backlog size ${backlog.length}`
            ],
            level: "trace"
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

            backlog.push(...received.filter(x => Array.isArray(x)));

        }

    }
}