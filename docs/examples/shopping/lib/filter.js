import { Logged } from "./log.js";

const asArray = x => Array.isArray(x) ? x : x === undefined ? [] : [x];

export default function Filter(...args) {

    const name = typeof args[0] === "string" ? args.shift() : "Filter entity";
    let [messages, recipient] = args;

    messages = Array.isArray(messages) ? messages : [messages];

    return async (messageType, messageData) => {
        if (messages.includes(messageType)) {
            const result = [];

            // log that we are allowing it (unless it's a log message we're allowing)
            if (messageType !== Logged) {

                const message = ["Allowing", messageType];
                if (recipient?.id) message.push("to", recipient?.id);
                const logMessage = {
                    level: messageType === Logged ? "logging" : "trace",
                    source: name,
                    message,
                };
                result.push([Logged, logMessage]);

            }

            const output = await recipient(messageType, messageData);
            if (output) {
                result.push(...output);
            }

            return result;


        }
    };
};