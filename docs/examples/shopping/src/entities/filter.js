import { log, Logged } from "./log.js";

const asArray = x => Array.isArray(x) ? x : x ? [x] : [];

export default function Filter(...args) {

    const name = typeof args[0] === "string" ? args.shift() : "Filter entity";
    let [messages, recipient] = args;

    messages = Array.isArray(messages) ? messages : [messages];

    return async (messageType, ...args) => {

        if (messages.includes(messageType)) {

            return await allow(messageType, args);

        }

    };

    async function allow(messageType, args) {

        return logAllow(messageType).concat(
            asArray(await recipient(messageType, ...args))
        );
    }



    function logAllow(messageType) {

        const result = [];

        // log that we are allowing it (unless it's a log message we're allowing)
        if (messageType !== Logged) {

            const message = ["Allowing", messageType];
            if (recipient?.id)
                message.push("to", recipient?.id);
            result.push(log("trace", name, message));

        }
        return result;

    }

};