const body = createElement("BODY");
global.document = {
    get body() { return body; },
    createElement,
    createTextNode,
};
function createTextNode(text) {
    return {
        get textContent() { return text; }
    };
}
function createElement(tagName) {

    let attributes = {};
    let children = [];
    let eventListeners = {};
    return {
        setAttribute(name, value) {
            attributes[name] = value;
        },
        appendChild(child) {
            children.push(child);
        },
        addEventListener(eventType, eventHandler) {
            if (!(eventType in eventListeners)) {
                eventListeners[eventType] = [];
            }
            eventListeners[eventType].push(eventHandler);
        }
    };
}
