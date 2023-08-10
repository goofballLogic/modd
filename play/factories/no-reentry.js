export function NoReentry(filtered) {

    const marker = Symbol(NoReentry.name);
    const raw = [];

    function mark(message, type) {

        if (type === "object") {

            message[marker] = true;

        } else {

            raw.push(message);

        }

    }

    function markMessages(messageOrMessages) {

        if (Array.isArray(messageOrMessages)) {

            messageOrMessages.forEach(message => mark(message, typeof message));

        } else {

            mark(messageOrMessages, typeof messageOrMessages);

        }

    }

    return message => {

        const type = typeof message;
        if (type === "object" && marker in message) return undefined;
        if (raw.includes(message)) return undefined;
        //mark(message, type);
        const ret = filtered(message);
        markMessages(ret);
        return ret;

    }

}
