import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";

import DOMElements from "../src/entities/dom-elements.js";

describe("DOM Elements", () => {

    describe("Given a container and some HTML", () => {

        let container = null;
        beforeEach(() => {

            container = document.createElement("body");
            DOMElements("<span>hello</span><span>world</span>", { container });

        });

        it("Then it should render the HTML at the end of the container", () => {
            expect(container.children).to.have.length(2);
            expect(container.children[0].outerHTML).to.equal("<span>hello</span>");
            expect(container.children[1].outerHTML).to.equal("<span>world</span>");
        });

    });

    describe("Given rendered DOM elments", () => {

        let container, element;
        const newContentMessage = Symbol("New content");
        const originalHTML = "<span>hello</span><span>also hello</span>";

        beforeEach(() => {

            container = document.createElement("body");
            element = DOMElements(originalHTML, {
                container,
                allowedMessages: [newContentMessage]
            });

        });

        describe("When it receives a message", () => {

            beforeEach(async () => {

                await element(newContentMessage, "goodbye");

            });

            it("Then its HTML should be unchanged", () => {

                expect(container.innerHTML).to.equal(originalHTML);

            });

        });

    });

    describe("Given rendered DOM elments with rendering", () => {

        let container, element;
        const newContentMessage = Symbol("New content");
        function render(messageType, messageData, elements) {
            if (messageType === newContentMessage)
                elements[0].innerHTML =
                    `${messageType.description}: ${messageData?.message}`;
        }

        beforeEach(() => {

            container = document.createElement("body");
            element = DOMElements("<span>hello</span>", {
                container,
                allowedMessages: [newContentMessage],
                render
            });

        });

        describe("When it receives a message", () => {

            beforeEach(async () => {

                await element(newContentMessage, { "message": "something" });

            });

            it("Then it should update its HTML accordingly", () => {

                const expected = "<span>New content: something</span>";
                expect(container.innerHTML).to.equal(expected);

            });

        });

    });

    describe("Given DOM elements containing groups of others", () => {

        let outerElement;
        let container;

        const someMessage = Symbol("Some message");

        beforeEach(() => {

            container = document.createElement("body");
            outerElement = DOMElements(
                `
                    <div></div>
                    <footer>A footer</footer>
                `,
                {
                    name: "Outer element",
                    children: [
                        InnerGroup1(),
                        InnerGroup2()
                    ],
                    container
                }
            );

            function InnerGroup1() {

                return DOMElements(
                    `
                        <span>Hello 1</span>
                        <span>Hello 2</span>
                    `,
                    {
                        name: "inner group 1"
                    }
                );

            }

            function InnerGroup2() {

                return DOMElements(
                    `
                        <span>Hello 3</span>
                        <span>Hello 4</span>
                    `,
                    {
                        name: "inner group 2",
                        render(messageType, messageData, spans) {
                            if (messageType === someMessage)
                                spans[1].innerHTML = `INNER: ${messageData}`;
                        }
                    }
                );

            }

        });

        it("Then the inner elements should have rendered nested inside the outer ones", () => {

            const actual = cleanHTML(container.innerHTML);
            const expected = cleanHTML(
                `
                    <div>
                        <span>Hello 1</span>
                        <span>Hello 2</span>
                        <span>Hello 3</span>
                        <span>Hello 4</span>
                    </div>
                    <footer>A footer</footer>
                `
            );
            expect(actual).to.equal(expected);

        });

        describe("When the top level DOM element receives a message", () => {

            beforeEach(async () => {

                await outerElement(someMessage, "hello ms. inner");

            });

            it("Then the inner elements should also receive the message", () => {

                const actual = cleanHTML(container.innerHTML);
                expect(actual).to.include("INNER: hello ms. inner");

            });

        });

    });

});


function cleanHTML(html) {
    return html.replace(/\s*\n\s*/g, "");
}