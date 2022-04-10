import { log, Logged } from "./log.js";
import { asArray } from "../maps/arrays.js";

export default function Filter(...args) {

    // TODO: remove older (type 2) parameterisation
    let name, messages, blacklist, recipient, blacklistEntities;

    if (typeof args[0] === "object") {
        ({ name, messages, blacklist, blacklistEntities } = args[0]);
        recipient = args[1];
    } else if (typeof args[0] === "string") {
        name = typeof args[0] === "string" ? args.shift() : "Filter entity";
        [messages, recipient] = args;
    }

    messages = asArray(messages);

    const filterByMessageType = blacklist
        ? mt => !messages.includes(mt)
        : mt => messages.includes(mt);

    const messageAllowed = blacklistEntities
        ? mt => ("function" !== typeof mt) && filterByMessageType(mt)
        : filterByMessageType

    const filter = async (messageType, ...args) => {
        if (messageAllowed(messageType))
            return await allow(messageType, args);

    };
    filter.id = name;
    return filter;

    async function allow(messageType, args) {

        return [
            ...logAllow(messageType),
            ...asArray(await recipient(messageType, ...args))
        ];

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