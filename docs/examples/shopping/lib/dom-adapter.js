const messageSentEvent = "modd:message-sent";
const messageReceivedEvent = "modd:message-received";

export function ContextPort(name, elementSelector, send) {

    const element = document.querySelector(elementSelector);
    if (!element) throw new Error(`Element not found: ${elementSelector}`);

    return Port({
        name,
        element,
        messageProcessor: send,
        messageEventToHandle: messageSentEvent,
        messageEventToDispatch: messageReceivedEvent
    });

}

export function ElementPort(name, element, receive) {

    return Port({
        name,
        element,
        messageProcessor: receive,
        messageEventToHandle: messageReceivedEvent,
        messageEventToDispatch: messageSentEvent
    });

}

function Port({
    name,
    element,
    messageProcessor,
    messageEventToHandle,
    messageEventToDispatch
}) {

    function messageHandler(e) {

        const [messageType, messageData] = e.detail;

        console.group("port:", name);
        console.log("handling", messageType);
        console.groupEnd();

        messageProcessor(messageType, messageData);
    }

    element.addEventListener(messageEventToHandle, messageHandler);

    let isDisposed = false;

    const port = async (messageType, messageData) => {

        if (isDisposed) {
            throw new Error(`Port "${name}" is disposed trying to send "${messageType?.description}"`);
        }

        console.group("port:", name);
        console.log("dispatching", messageType);
        console.groupEnd();

        element.dispatchEvent(new CustomEvent(messageEventToDispatch, {
            detail: [
                messageType,
                messageData
            ]
        }));
    };

    // teardown removes the event listener
    port.dispose = () => {

        console.group("port:", name);
        console.log("disposing");
        console.groupEnd();

        element.removeEventListener(messageEventToHandle, messageHandler);
        isDisposed = true;
        port.dispose = () => { };

    };

    return port;
}
