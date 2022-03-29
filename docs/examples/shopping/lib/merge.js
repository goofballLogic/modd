import { Logged } from "./log.js";
import Filter from "./filter.js";

export default function Merge({ name, resetMessageType, accumulators, output }) {

    let cache = {};
    const allowedMessages = Array.from(new Set([resetMessageType, ...accumulators]));

    return Filter(`${name} filter`, allowedMessages, async (messageType, messageData) => {

        if (messageType === resetMessageType)
            cache = {};

        if (accumulators.includes(messageType))
            cache[messageType] = messageData;

        if (accumulators.every(a => a in cache)) {

            return await renderOutputs();

        }

    });

    async function renderOutputs() {

        const results = [].concat(await output(cache) || []);
        return [
            [
                Logged,
                {
                    source: name,
                    message: ["Merged and dispatching", ...results.map(x => x[0])],
                    level: "trace"
                }
            ],
            ...results
        ];

    }

}
