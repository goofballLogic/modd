import { Logged } from "./log.js";
import Filter from "./filter.js";

let count = 1;

const asArray = xs => Array.isArray(xs) ? xs : xs ? [xs] : [];

export default function Merge({ name, resetMessageType, accumulators, output }) {

    let cache = {};

    const mergeId = Symbol(name || `merge ${count++}`);

    const allowedMessages = accumulators.includes(resetMessageType)
        ? accumulators
        : [resetMessageType, ...accumulators];

    return Filter(`${name} filter`, allowedMessages, async (messageType, messageData) => {

        if (isTainted(messageData)) return [];

        if (messageType === resetMessageType)
            cache = {};

        if (accumulators.includes(messageType))
            cache[messageType] = messageData;

        if (accumulators.every(a => a in cache))
            return await renderOutputs();

    });

    async function renderOutputs() {

        const results = taint(asArray(await output(cache)));
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

    function taint(xs) {
        return xs.map(x => {

            if (Array.isArray(x)) {
                const [_, data] = x;
                if (data && typeof data === "object") {
                    data[mergeId] = true;
                }
            }
            return x;
        })
    }

    function isTainted(x) {
        return x && (typeof x === "object") && mergeId in x;
    }

}
