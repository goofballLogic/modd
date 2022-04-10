import { Reaction } from "./reaction.js";
import { log } from "./log.js";
import { asArray } from "../maps/arrays.js";

export function SwitchableElementReaction(
    {
        name,
        selectElement,
        calculateHash,
        mutate
    },
    html
) {

    return container => {

        const template = document.createElement("TEMPLATE");
        template.innerHTML = html;
        const elements = Array.from(template.content.children);

        let selected = selectElement(null, null, ...elements);
        container.appendChild(selected);

        return Reaction({
            name,
            calculateHash,
            mutate: async (messageType, messageData) => {

                // update selection
                const newlySelected = await selectElement(messageType, messageData, ...elements);
                const messages = makeSelection(newlySelected);
                // mutate
                const mutateResult = await mutate(messageType, messageData, selected);
                // return results
                return messages.concat(...asArray(mutateResult));

            }
        });

        function makeSelection(newlySelected) {

            const messages = [];
            if (newlySelected !== selected) {

                messages.push(log(
                    "trace",
                    name,
                    ["switching elements from", selected, "to", newlySelected]
                ));
                selected.replaceWith(newlySelected);
                selected = newlySelected;

            }
            return messages;

        }

    };

}
