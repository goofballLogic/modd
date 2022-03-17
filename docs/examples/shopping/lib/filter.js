export default function Filter(messages, recipient) {

    messages = Array.isArray(messages) ? messages : [messages];

    return async (messageType, messageData) => {
        if (messages.includes(messageType))
            return await recipient(messageType, messageData);
    };

};