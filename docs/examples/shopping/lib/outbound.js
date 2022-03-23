let counter = 100;

const isTaintable = x => (typeof x === "object") && x !== null;

export default function Outbound(...args) {

    // retrieve name and factory, or synthesize name as needed
    const [name, insideFactory] = typeof args[0] === "string"
        ? args
        : [`Outbound ${counter++}`, args[0]];

    const outboundId = Symbol(name);

    // this is where the outside entity will be referenced
    let outside = () => { };

    // a function to send things to the outside
    const sendToOutside = async (...args) => {

        const [messageType, messageData] = args;
        if (typeof messageType !== "function") {

            if (isTaintable(messageData))
                messageData[outboundId] = true;

            await outside(...args);

        }

    };

    // call the factory for the inner entity, passing it a "send" function
    const inside = insideFactory(sendToOutside);

    // validate entity
    if (typeof inside !== "function")
        throw new Error("No entity returned from inner factory");

    const inbound = (...args) => {

        // is this the outside entity?
        if (typeof args[0] === "function") {

            outside = args[0];
            return;

        }

        // is this a message we sent out?
        const [, messageData] = args;
        const wasSentByUs = isTaintable(messageData) && (outboundId in messageData);
        if (wasSentByUs) return;

        // otherwise, let the message through
        return inside(...args);

    };
    inbound.id = `${name} inbound`;
    return inbound;

}