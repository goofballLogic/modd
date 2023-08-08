import { Page } from "../factories/Page.js";
import { calculatorWidget } from "./calculator-widget.js";
import { powerWidget } from "./power-widget.js";


export const homePage = Page("home", {
    container: "main",
    components: [
        powerWidget,
        calculatorWidget
    ]
});

