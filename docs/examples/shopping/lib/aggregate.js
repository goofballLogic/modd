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

    function inspectBacklog() {
        console.group(aggregateName);
        console.log("Backlog size ", backlog.length);
        console.log(...backlog);
        console.groupEnd();
    }

    async function processBacklog() {
        processingBacklog = true;
        try {
            while (backlog.length) {
                inspectBacklog();
                const [messageType, messageData] = backlog.shift();
                await send(messageType, messageData);
            }
        } finally {
            processingBacklog = false;
        }
    }

    async function send(messageType, messageData) {

        const snapshot = [...components];
        for (const component of snapshot) {

            const received = await component(messageType, messageData);
            if (Array.isArray(received)) {

                backlog.push(...received.filter(x => Array.isArray(x)));

            }

        }

    }

}