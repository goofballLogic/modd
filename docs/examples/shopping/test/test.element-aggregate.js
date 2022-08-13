import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import ElementAggregate, { bookmarkAttribute } from "../src/entities/element-aggregate.js";

describe("Element aggregate", () => {

    describe("Given an element aggregate containing some entities", () => {

        let elementAggregate;
        let container;

        function GreetingDisplay(name) {

            const el = document.createElement("DIV");

            return (_, md) => {

                const position = md[bookmarkAttribute];
                if (el.parentElement !== container || Array.from(container.childNodes).indexOf(el) !== position)
                    container.insertBefore(el, container.childNodes[position]);
                el.innerHTML = `${name}: ${md.greeting}`;

            };

        }

        beforeEach(() => {

            container = document.createElement("SECTION");
            const entities = [
                GreetingDisplay("first element"),
                GreetingDisplay("second element")
            ];
            elementAggregate = ElementAggregate({
                container,
                entities
            });

        });

        describe("When the aggregate receives a message", () => {

            beforeEach(async () => {

                await elementAggregate("greeting", { greeting: "hello" });

            });

            it("Then the resulting HTML should reflect the rendered greetings", () => {

                const actualHTML = container.innerHTML;
                expect(actualHTML).to.equal("<div>first element: hello</div><div>second element: hello</div>");

            });

        });

    });

});