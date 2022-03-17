import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import { ContextPort } from "../lib/dom-adapter.js";
import "./MODDTestsExampleElement.js";

describe("DOM Adapter", () => {

    describe("Given a DOM element with a port", function () {

        let exampleElement;

        beforeEach(() => {

            exampleElement = document.createElement("modd-tests-example-element");
            exampleElement.id = "el_" + Date.now();
            document.body.appendChild(exampleElement);

        });

        describe("And a context-side port is created", function () {

            let contextPort;
            let contextSideMessagesReceived;

            beforeEach(() => {
                contextSideMessagesReceived = [];
                const elementSelector = `#${exampleElement.id}`;
                contextPort = ContextPort(
                    "example-element_context-side",
                    elementSelector,
                    (mt, md) => contextSideMessagesReceived.push([mt, md])
                );
            });

            describe("When the adapter receives a message", function () {

                const message1 = Symbol("Message 1");

                beforeEach(async () => {

                    await contextPort(message1, "hello to the DOM element");

                });

                it("Then the DOM element should receive the message", () => {

                    const expected = [message1, "hello to the DOM element"];
                    expect(exampleElement.received).to.deep.equal([expected]);

                });

            });

            describe("When the adapter receives a message but the element was removed from the document and has disposed its port", function () {

                const message2 = Symbol("Message 2");

                beforeEach(async () => {

                    exampleElement.remove();
                    await contextPort(message2, "into the void");

                });

                it("Then the DOM element should NOT receive the message", () => {

                    expect(exampleElement.received).to.deep.equal([]);

                });

            });


            describe("When the element sends a message via the port", function () {

                const message3 = Symbol("Message 3");

                beforeEach(async () => {

                    exampleElement.sendAMessage(message3, "hello from the element");

                });

                it("Then the context should have received the sent message", () => {

                    const expected = [message3, "hello from the element"];
                    expect(contextSideMessagesReceived).to.deep.equal([expected]);

                });

            });

            describe("When the element sends a message but the port is already disposed", function () {

                const message3 = Symbol("Message 3");
                let caught;

                beforeEach(async () => {

                    exampleElement.remove();
                    try {
                        await exampleElement.sendAMessage(message3, "hello from the element");
                    } catch (err) {
                        caught = err;
                    }
                });

                it("Then the attempt to send should have raised an error", () => {

                    expect(caught).to.be.an("error");
                    expect(caught.message).to.include("example-element", "expected the name of the port");
                    expect(caught.message).to.include("Message 3", "expected the description of the message");

                });

                it("Then the context should NOT have received the sent message", () => {

                    expect(contextSideMessagesReceived).to.deep.equal([]);

                });

            });

        });

    });

});
