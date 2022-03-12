export default function Transformer(name, fromMessageType, toMessageType, transform) {
    return async (messageType, messageData) => {
        if (messageType == fromMessageType) {
            console.group(name);
            console.log(messageData);
            console.groupEnd();
            const toMessageData = await transform(clone(messageData));
            return [[toMessageType, toMessageData]];
        }
    }
}

function clone(x) {
    return JSON.parse(JSON.stringify(x));
}