import Filter from "./filter.js";

export default function ListDiff({ inputMessage, outputMessage, itemsExtractor, keyExtractor }) {

    itemsExtractor = itemsExtractor || (x => x.items);
    keyExtractor = keyExtractor || (x => x.id);
    let state = [];
    return Filter({ messages: [inputMessage] }, processData);

    function processData(_messageType, messageData) {
        const items = itemsExtractor(messageData);
        const nextIndex = Object.fromEntries(items.map(x => [keyExtractor(x), x]));
        const next = Object.keys(nextIndex).sort();
        const remove = state.filter(x => !next.includes(x));
        const add = next.filter(x => !state.includes(x));
        const data = Object.fromEntries(add.map(i => [i, nextIndex[i]]));
        state = next;
        return [[
            outputMessage,
            {
                add,
                remove,
                data
            }
        ]];
    }

}