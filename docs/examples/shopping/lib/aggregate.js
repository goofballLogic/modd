export default function Aggregate(aggregateName, components = []) {

    if (!components.every(x => x))
        throw Error("Non entity supplied in list of components");

    const backlog = [];
    let processingBacklog = false;

    const aggregate = async (messageType, messageData) => {
        backlog.push([messageType, messageData]);
        if (!processingBacklog) {
            await processBacklog();
        }
    };

    send(aggregate);

    return aggregate;

    function inspectBacklog() {
        console.group(aggregateName);
        for (const x of backlog) {
            console.log(x);
        }
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
        for (const component of components) {
            const received = await component(messageType, messageData);
            if (Array.isArray(received)) {
                backlog.push(...received.filter(x => Array.isArray(x)));
            }
        }
    }
}