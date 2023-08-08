import { Widget } from "../factories/Widget.js";

export const powerWidget = Widget(
    "power",
    {
        inputs: [],
        parts: [
            {
                element: "button",
                name: "power",
                value: "on/off",
                text: "AC",
                export: true
            }
        ]
    }
);
