import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import Context from "../src/entities/context.js";

describe("Context", () => {

    describe("Given a context containing an entity", () => {

        const allowedInboundMessage = Symbol("Allowed inbound");
        const allowedOutboundMessage = Symbol("Allowed outbound");
        const otherMessage = Symbol("Other message");

        // inside the context
        let messagesReceivedByTheInside = [];
        const theInside = (...args) => {
            messagesReceivedByTheInside.push(args);
        };

        // the context
        let context;

        // the outside of the context
        let messagesReceivedByTheOutside = [];
        const theOutside = (mt, md) => {
            messagesReceivedByTheOutside.push([mt, md]);
        };

        beforeEach(() => {

            // create the context
            context = Context(
                {
                    name: "the context",
                    inbound: [allowedInboundMessage], // allowed inbound
                    outbound: [allowedOutboundMessage] // allowed outbound
                },
                outside => { // factory
                    theInside.sendToOutside = outside;
                    return theInside;
                }
            );

            // connect the outside to the context
            context(theOutside);

            // reset messages recorded
            messagesReceivedByTheInside = [];
            messagesReceivedByTheOutside = [];
        })

        describe("When the context receives an allowed inbound message", () => {

            beforeEach(async () => {
                await context(
                    allowedInboundMessage,
                    { text: "allowed inbound" }
                );
            });

            it("Then the inbound message should be received", () => {
                expect(messagesReceivedByTheInside).to.deep.equal([
                    [allowedInboundMessage, { text: "allowed inbound" }]
                ]);
            });

        });

        describe("When the context receives a disallowed inbound message", () => {

            beforeEach(async () => {
                await context(
                    otherMessage,
                    { text: "not allowed inbound" }
                );
            });

            it("Then the inbound message should not be received", () => {
                expect(messagesReceivedByTheInside).to.have.lengthOf(0);
            });

        });

        describe("When the entity sends an allowed outbound message", () => {

            beforeEach(async () => {
                await theInside.sendToOutside(
                    allowedOutboundMessage,
                    { text: "allowed outbound" }
                );
            });

            it("Then the outbound message should be received by the outisde", () => {
                expect(messagesReceivedByTheOutside).to.deep.equal([
                    [allowedOutboundMessage, { text: "allowed outbound" }]
                ]);
            });

        });

        describe("When the entity sends a disallowed outbound message", () => {

            beforeEach(async () => {
                await theInside.sendToOutside(
                    otherMessage,
                    { text: "not allowed outbound" }
                )
            });

            it("Then the outbound message should not be received by the outside", () => {
                expect(messagesReceivedByTheOutside).to.have.lengthOf(0);
            });

        });

    });

});