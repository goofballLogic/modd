import { log } from "./log.js";

const asArray = x => Array.isArray(x) ? x : x ? [x] : [];

export function Reaction({
    name,
    calculateHash,
    mutate
}) {

    let previousHash = undefined;

    return async (messageType, messageData) => {

        const newHash = await calculateHash(messageType, messageData);
        if (previousHash != newHash) {

            previousHash = newHash;
            return [
                log("trace", name, "Mutating"),
                ...asArray(await mutate(messageType, messageData))
            ];

        }

    };

}
