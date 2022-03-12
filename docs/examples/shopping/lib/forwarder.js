export default function Forwarder(name, messageTypeToForward, recipient) {

    const send = typeof recipient === "function"
        ? (...args) => (recipient())(...args)
        : recipient;

    const correlationId = Symbol(name)

    return async (messageType, messageData) => {
        if (messageData && correlationId in messageData) {
            console.group(name);
            console.log("already forwarded", messageType, messageData);
            console.groupEnd();
            return;
        }

        if (messageType === messageTypeToForward) {
            console.group(name);
            console.log("forwarding", messageType, messageData);
            console.groupEnd();
            messageData[correlationId] = true;
            await send(messageType, messageData);
        }
    };
}