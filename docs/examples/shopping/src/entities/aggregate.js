import { Logged, History } from "./log.js";

let logid = 1000;

function isTaintable(x) {
    return (typeof x === "object") && !!x;
}

export default function Aggregate(aggregateName, components = []) {

    const aggregateId = Symbol(aggregateName);

    components = [...components];
    if (!components.every(x => x))
        throw Error("Non entity supplied in list of components");

    const backlog = [];
    let processingBacklog = false;

    const aggregate = async (...args) => {

        if (typeof args[0] === "function") {

            const [component] = args;
            components.push(component);
            if (component === aggregate) {
                throw new Error(`${aggregateId} passed to itself`);
            }
            sendTo(component, aggregate);

        } else {

            await processNormalMessage(...args);

        }

    };

    aggregate.id = aggregateId;

    send(aggregate);

    return aggregate;

    async function processNormalMessage(messageType, messageData) {

        if (isTaintable(messageData) && aggregateId in messageData)
            return;

        if (messageType !== Logged) {

            backlog.push([Logged, {
                source: aggregateName,
                message: ["Received", logid++, messageType, "stack:", (messageData && messageData[History]) || []],
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
        if (messageData && typeof messageData === "object") {

            messageData[aggregateId] = true;
            messageData[History] = [aggregateName].concat(messageData[History] || []);

        }
        await send(messageType, messageData);
        if (messageType !== Logged) {

            await logSent(messageType, messageData && messageData[History]);

        }

    }

    async function logSent(messageType, history = []) {

        await send(Logged, {
            source: aggregateName,
            message: [
                "Sent",
                messageType,
                `Remaining backlog size ${backlog.length}`,
                history
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

    async function sendTo(component, ...args) {

        if (args.length === 1) {

            await component(args[0])

        } else {

            const [messageType, messageData] = args;
            const results = await component(messageType, messageData);
            if (Array.isArray(results)) {

                for (const result of results) {

                    if (Array.isArray(result)) {

                        const [messageType, messageData] = result;
                        // invoke async method synchronously to allow event loop to drain
                        aggregate(messageType, messageData);

                    }

                }

            }

        }

    }

}