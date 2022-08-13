export default function DOMElement2({
    container,
    mutate
}, html) {

    const template = document.createElement("TEMPLATE");

    template.innerHTML = html;
    let elements = Array.from(template.content.cloneNode(true).children);
    container.appendChild(...elements);

    return async (messageType, messageData) => {
        await mutate({
            elements,
            latest(...messageTypes) {
                return [messageType, messageData];
            }
        });
    };
}

