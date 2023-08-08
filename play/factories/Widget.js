export const Widget_Rendered = Symbol("Widget.Rendered");
export const Widget_Input = Symbol("Widget.Input");
export const Widget_Command = Symbol("Widget.Command");

import { Aggregate } from "./Aggregate.js";
import { Observable } from "./Observable.js";
import { Outbox } from "./Outbox.js";

function Filter(messageTypes, filtered) {

    return (!messageTypes)
        ? filtered // not filtered
        : message => {
            if (typeof message === "function" || messageTypes.includes(message?.type)) {
                return filtered(message);
            } else {
                console.warn("Dropped", message);
            }
        };

}

export function Widget(name, spec) {

    const self = Outbox(
        `Widget[${name}]`,
        outside =>
            Aggregate(
                `Widget[${name} - internal]`,
                [
                    ...(spec.components || []),
                    WidgetForm({ name, spec, outside })
                ]
            )
    );
    self.id = `Widget[${name}]`;
    return Filter(
        spec.inputs || null,
        Observable(self)
    );

}

const renderers = {
    "input": renderInput,
    "literal": renderLiteral,
    "output": renderOutput,
    "button": renderButton
};
const updaters = [updateOutput];

function WidgetForm({ name, spec, outside }) {

    let form;
    const id = `Form[${name}]`;
    const self = Outbox(`Form[${name}]`, inside => {

        if (!form) {

            form = document.createElement("FORM");
            if (spec.parts) {

                for (const part of spec.parts) {

                    const renderer = renderers[part.element] || renderUnknown;
                    form.appendChild(renderer(part, inside, outside));

                }

            }
            form.addEventListener("input", () => {

                const formData = Object.fromEntries(new FormData(form).entries());
                inside({
                    type: Widget_Input,
                    ...formData,
                });

            });
            outside({ type: Widget_Rendered, rendered: form });

        }

        return message => {

            updaters.forEach(updater => updater(message, form));

        };

    });
    self.id = id;
    return Observable(self);

}

function renderButton(part, inside, outside) {

    const button = document.createElement("BUTTON");
    button.setAttribute("type", "button");
    button.setAttribute("name", part.name);
    button.setAttribute("value", part.value);
    button.textContent = part.text;
    const channel = part.export ? outside : inside;
    button.addEventListener("click", () => { channel({ type: Widget_Command, ...part }); });
    return button;

}

function renderInput(part) {

    const input = document.createElement("INPUT");
    input.type = part.type || "text";
    input.setAttribute("name", part.name);
    return input;

}

function renderLiteral(part) {

    switch (part.type) {
        case "text":
            return document.createTextNode(part.value);
        default:
            return renderUnknown(part);
    }

}

function renderOutput(part) {

    const output = document.createElement("OUTPUT");
    output.setAttribute("name", part.name);
    return output;

}

function updateOutput(message, form) {

    for (const output of form.querySelectorAll("output")) {

        const name = output.getAttribute("name");
        if (name in message) {

            output.textContent = message[name];

        }

    }

}

function renderUnknown(part) {

    const el = document.createElement("ASIDE");
    el.className = "unknown-element";
    el.textContent = `Unknown widget spec part: ${JSON.stringify(part)}`;
    return el;

}
