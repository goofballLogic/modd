import { Logged } from "./log.js";

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
        messageEventToDispatch: messageReceivedEvent,
        log: data => send(Logged, data)
    });

}

export function ElementPort(name, element, receive) {

    return Port({
        name,
        element,
        messageProcessor: receive,
        messageEventToHandle: messageReceivedEvent,
        messageEventToDispatch: messageSentEvent,
        log: data => dispatch(element, messageSentEvent, Logged, data)
    });

}

function Port({
    name,
    element,
    messageProcessor,
    messageEventToHandle,
    messageEventToDispatch,
    log
}) {

    function messageHandler(e) {
        const [messageType, messageData] = e.detail;

        log({
            source: `port: ${name}`,
            message: ["handling", messageType, messageData],
            level: messageType === Logged ? "logging" : "debug"
        });

        messageProcessor(messageType, messageData);
    }

    element.addEventListener(messageEventToHandle, messageHandler);
    let isDisposed = false;

    const port = async (messageType, messageData) => {

        if (isDisposed) {
            throw new Error(`Port "${name}" is disposed trying to send "${messageType?.description}"`);
        }

        log({
            source: `port: ${name}`,
            message: ["dispatching", messageType, messageData],
            level: messageType === Logged ? "logging" : "trace"
        });

        dispatch(element, messageEventToDispatch, messageType, messageData);
    };

    // teardown removes the event listener
    port.dispose = () => {

        log({
            source: `port: ${name}`,
            message: ["disposing"],
            level: "trace"
        });

        element.removeEventListener(messageEventToHandle, messageHandler);
        isDisposed = true;
        port.dispose = () => { };

    };

    return port;
}

function dispatch(element, messageEventToDispatch, messageType, messageData) {
    const messageEvent = new CustomEvent(messageEventToDispatch, {
        detail: [
            messageType,
            messageData
        ]
    });
    element.dispatchEvent(messageEvent);
}

