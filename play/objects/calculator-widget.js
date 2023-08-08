import { Widget, Widget_Command } from "../factories/Widget.js";
import { xySum } from "./xy-sum.js";

const calculatorParts = [
    {
        element: "input",
        type: "number",
        name: "x"
    }, {
        element: "literal",
        type: "text",
        value: " + "
    }, {
        element: "input",
        type: "number",
        name: "y"
    }, {
        element: "literal",
        type: "text",
        value: " = "
    }, {
        element: "output",
        name: "sum"
    }
];

export const calculatorWidget = Widget(
    "calculator",
    {
        inputs: [ Widget_Command ],
        parts: calculatorParts,
        components: [
            xySum
        ]
    }
);
