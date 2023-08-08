import { Aggregate } from "./Aggregate.js";
import { Widget_Rendered } from "./Widget.js";

export function Page(name, { container, components }) {

    container = resolveContainer(container);

    const id = `Page[${name}]`;
    return Aggregate(
        id,
        [

            ...components,
            message => {

                switch (message.type) {
                    case Widget_Rendered:
                        if (message.rendered) {

                            [].concat(message.rendered).forEach(render);

                        }
                        break;
                }

            }

        ],
        { ignoreNoReceivers: true }
    );

    function render(child) {

        container.appendChild(child);

    }

}

function resolveContainer(container) {

    if (typeof container === "string")
        container = document.querySelector(container);
    container = container || document.body;
    return container;

}

