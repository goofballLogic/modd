
let count = 1000;

export default function DOMElementList(
    htmlOrElementFactory,
    {
        container,
        extract,
        mutate
    } = {}
) {

    name = name || `DOMElements ${count++}`;

    function buildForContainer(container) {

        // item template
        const template = document.createElement("TEMPLATE");
        template.innerHTML = html;

        // for each extracted data item, create and append a child
        async function appendChildForData([_id, data]) {

            const element = itemTemplate.content.cloneNode(true);
            await mutate(element, data);
            container.appendChild(element);

        }

        return async (messageType, messageData) => {

            const extracted = await extract(messageType, messageData);
            container.innerHTML = "";
            await Promise.allSettled(extracted.map(appendChildForData));

        };

    }

    return container ? buildForContainer(container) : buildForContainer;

}