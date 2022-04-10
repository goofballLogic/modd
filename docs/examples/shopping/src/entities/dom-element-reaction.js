import { Reaction } from "./reaction.js";

export function ElementReaction({
    name,
    calculateHash,
    mutate
}, html) {

    return container => {

        const template = document.createElement("TEMPLATE");
        template.innerHTML = html;
        const elements = Array.from(template.content.children);
        for (const el of elements)
            container.appendChild(el);

        return Reaction({
            name,
            calculateHash,
            mutate: async (messageType, messageData) =>
                await mutate(messageType, messageData, ...elements)
        });
    };

}
