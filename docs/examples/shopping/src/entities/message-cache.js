export default function MessageCache(messagesToCache, inner) {

    const cache = {};
    messagesToCache = Array.isArray(messagesToCache) ? messagesToCache : [messagesToCache];
    return async (messageType, messageData) => {

        if (messagesToCache.includes(messageType)) {
            cache[messageType] = messageData;
        }
        return await inner(messageType, messageData, cache);

    };

}
