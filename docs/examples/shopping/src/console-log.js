import { Logged } from "../lib/log.js";

export default function ConsoleLog(minLogLevel = "debug") {

    const logLevels = {
        "trace": 1,
        "debug": 2,
        "warn": 3,
        "error": 4
    };

    minLogLevel = logLevels[minLogLevel];

    return async function consoleLog(messageType, messageData) {

        if (messageType === Logged) {

            new Promise(() => {
                const { level, message, source } = messageData;
                const messageLogLevel = logLevels[level];
                if (minLogLevel > messageLogLevel)
                    return;

                const messageDescription = message.map(x => {
                    try {
                        if (typeof x === "symbol")
                            return x;
                        if (typeof x === "object")
                            return "...";
                        return `${x}`;
                    } catch (err) {
                        return "?";
                    }
                });
                console.groupCollapsed(level.toUpperCase(), source, ":", ...messageDescription);
                for (const x of Array.isArray(message) ? message : [message]) {
                    switch (level) {
                        case "error":
                            console.error(x);
                            break;
                        case "warn":
                            console.warn(x);
                            break;
                        default:
                            console.log(x);
                    }
                }
                console.groupEnd();
            });

        }

    };
}
