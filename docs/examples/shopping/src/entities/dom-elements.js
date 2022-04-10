import Filter from "./filter.js";
import Aggregate from "./aggregate.js";
import { asArray } from "../maps/arrays.js";
import { Logged } from "./log.js";

let count = 1;

export default function DOMElements(html, {
    name,
    container,
    children,
    messages,
    blacklist,
    render
} = {}) {

    const renderStrategy = render || (() => { });
    name = name || `DOMElements ${count++}`;

    children = asArray(children);
    messages = asArray(messages);
    if (!messages.length) {
        messages = [Logged]
        blacklist = true;
    }

    function buildForContainer(container) {

        // render my elements
        const myElements = renderElements(html, container);

        // render my children in their container
        const nestedChildren = children.map(child => child(myElements[0]));

        // return my entity
        return Filter(
            {
                name: `Filter for ${name}`,
                messages,
                blacklist,
                blacklistEntities: true
            },
            Aggregate(`Aggregate for ${name}`, [
                ...nestedChildren,
                (mt, md) => renderStrategy(mt, md, myElements),
            ])
        );

    }

    return container ? buildForContainer(container) : buildForContainer;

}

let template = null;

function renderElements(html, container) {

    template = template || document.createElement("TEMPLATE");
    template.innerHTML = html;
    const fragment = template.content.cloneNode(true);
    const elements = Array.from(fragment.children);
    container.appendChild(fragment);
    return elements;

}