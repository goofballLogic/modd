import { log, Logged } from "./log.js";
import { asArray } from "../maps/arrays.js";

let count = 1;
export default function Filter(...args) {

    // TODO: remove older (type 2) parameterisation
    let name, messages, blacklist, recipient, blacklistEntities;

    if (typeof args[0] === "object" && !Array.isArray(args[0])) {
        ({ name, messages, blacklist, blacklistEntities } = args[0]);
        recipient = args[1];
    } else if (typeof args[0] === "string") {
        name = typeof args[0] === "string" ? args.shift() : "Filter entity";
        [messages, recipient] = args;
    } else {
        [messages, recipient] = args;
    }

    name = name || `Filter ${count++}`;
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

        // don't log anything if we're handling a log message
        if (messageType === Logged)
            return [];

        // log that we are allowing it (unless it's a log message we're allowing)
        const message = ["Allowing", messageType];
        if (recipient?.id)
            message.push("to", recipient?.id);
        return [log("trace", name, ...message)];

    }

};