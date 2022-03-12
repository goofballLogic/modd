import { parentAggregateCreated } from "./aggregate.js";

export default function DOMDispatcher() {

    const registeredElements = new Map();

    let isDOMContentLoaded = false;

    document.addEventListener("DOMContentLoaded", () => {
        isDOMContentLoaded = true;
        processBacklog();
    });

    const backlog = [];
    let parentAggregate = null;

    const dispatcher = (messageType, messageData) => {
        if (messageType === parentAggregateCreated) {
            parentAggregate = messageData;
        } else {
            backlog.push([messageType, messageData]);
            processBacklog();
        }
    };
    dispatcher.register = (element, receive) => {
        registeredElements.set(element, receive);
    }
    dispatcher.unregister = element => {
        registeredElements.delete(element);
    }
    dispatcher.send = async function (messageType, messageData) {
        await parentAggregate(messageType, messageData)
    }

    return dispatcher;

    function processBacklog() {
        if (!isDOMContentLoaded) return false;
        while (backlog.length) {
            const [messageType, messageData] = backlog.shift();
            for (const [, receiver] of registeredElements) {
                receiver(messageType, messageData);
            }
        }
    }

}
