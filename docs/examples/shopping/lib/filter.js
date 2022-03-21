import { Logged } from "./log.js";

const asArray = x => Array.isArray(x) ? x : x === undefined ? [] : [x];

export default function Filter(...args) {

    const name = typeof args[0] === "string" ? args.shift() : "Filter entity";
    let [messages, recipient] = args;

    messages = Array.isArray(messages) ? messages : [messages];

    return async (messageType, messageData) => {
        if (messages.includes(messageType)) {
            const result = asArray(await recipient(messageType, messageData));
            // log that we are allowing it (unless it's a log message we're allowing)
            if (messageType !== Logged) {

                const logMessage = {
                    level: "debug",
                    source: name,
                    message: [`Sent: ${messageType.description ?? "?"}`],
                };
                result.push([Logged, logMessage]);

            }
            return result;

        }
    };
};