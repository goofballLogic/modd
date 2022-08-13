import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import { cleanHTML } from "./html-processing.js";
import DOMElementList from "../src/entities/dom-element-list.js";
import DOMElements from "../src/entities/dom-elements.js";

describe("DOM element list", () => {

    describe("Given a list with a container and HTML template", () => {

        let container, list;
        const dataMessage = Symbol("data");

        beforeEach(() => {

            container = document.createElement("body");
            list = DOMElementList(
                `<li></li>`,
                {
                    container,
                    extract: (messageType, messageData) => {

                        if (messageType === dataMessage) {

                            const items = messageData?.items || [];
                            return items.map(item => [item.itemId, item]);

                        }

                    },
                    mutate: (el, data) => {

                        el.children[0].textContent = data.name;

                    }
                }
            );

        });

        describe("When the list receives a data message", () => {

            beforeEach(async () => {

                const items = [
                    { itemId: 1234, name: "First" },
                    { itemId: 2345, name: "Second" }
                ];
                await list(dataMessage, { items });

            });

            it("Then the list renders as expected", () => {

                const expected = cleanHTML("<li>First</li><li>Second</li>");
                const actual = cleanHTML(container.innerHTML);
                expect(actual).to.equal(expected);

            });

        });

    });

    describe("Given a list with a container and DOM elements template", () => {

        let container, list;
        const dataMessage = Symbol("data");

        beforeEach(() => {

            container = document.createElement("body");
            list = DOMElementList(
                key => DOMElements(
                    "<li></li>",
                    {
                        mutate(messageType, messageData, elements) {

                            if (messageType === dataMessage) {

                                const items = messageData?.items || [];
                                const item = items[key] || {};
                                elements[0].innerHTML = item.name;

                            }

                        }
                    }
                ),
                {
                    container,
                    extract: (messageType, messageData) => {

                        if (messageType === dataMessage) {

                            const items = messageData?.items || [];
                            return items.map(item => [item.itemId, item]);

                        }

                    }
                }
            );

        });

        describe("When the list receives a data message", () => {

            beforeEach(async () => {

                const items = [
                    { itemId: 3456, name: "Third" },
                    { itemId: 4567, name: "Fourth" }
                ];
                await list(dataMessage, { items });

            });

            it("Then the list renders as expected", () => {

                const expected = cleanHTML("<li>Third</li><li>Fourth</li>");
                const actual = cleanHTML(container.innerHTML);
                expect(actual).to.equal(expected);

            });

        });

    });

});