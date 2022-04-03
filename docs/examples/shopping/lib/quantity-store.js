import Filter from "./filter.js";

export const clone = x => JSON.parse(JSON.stringify(x));

export default function QuantityStore({
    addedMessage,
    removedMessage,
    changedMessage,
    keyExtractor = x => x?.id,
    quantityExtractor = x => x?.quantity,
    emitMessage
}) {

    const items = {};
    return Filter(
        [addedMessage, removedMessage, changedMessage],
        async (messageType, messageData) => {

            const key = keyExtractor(messageData);
            const quantity = quantityExtractor(messageData);
            mutate(messageType, key, quantity);
            return emit();

        });

    function emit() {
        return [
            [emitMessage, { items: clone(items) }]
        ];
    }

    function mutate(messageType, key, quantity) {
        switch (messageType) {
            case addedMessage:
                items[key] = (items[key] || 0) + 1;
                break;
            case removedMessage:
                if (key in items)
                    delete items[key];
                break;
            case changedMessage:
                items[key] = quantity;
                break;
        }
    }
}
