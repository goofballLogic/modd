import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import ContextAggregate from "../lib/context-aggregate.js";
import { Logged } from "../lib/log.js";
import Outbound from "../lib/outbound.js";

describe("Context Aggregate", () => {

    describe("Given a context aggregate containing two entities", () => {

        const allowedInboundMessage = Symbol("Allowed inbound");
        const allowedOutboundMessage = Symbol("Allowed outbound");

        let entity1ReceivedMessages;
        const entity1 = (...args) => entity1ReceivedMessages.push(args);

        let entity2ReceivedMessages;
        let entity2SendMessage;
        const entity2 = Outbound(outside => {

            entity2SendMessage = outside;
            return (...args) => entity2ReceivedMessages.push(args);

        });

        let outsideReceivedMessages;
        const outside = (...args) => outsideReceivedMessages.push(args);

        let contextAggregate;

        beforeEach(async () => {
            entity1ReceivedMessages = [];
            entity2ReceivedMessages = [];
            outsideReceivedMessages = [];
            contextAggregate = ContextAggregate(
                {
                    name: "my context",
                    inbound: [allowedInboundMessage],
                    outbound: [allowedOutboundMessage]
                },
                [
                    entity1,
                    entity2
                ]
            );
            await contextAggregate(outside);
        });

        describe("When the I send an allowed message to the context", () => {

            const expected = [allowedInboundMessage, "hello, how are you?"];
            beforeEach(async () => {

                await contextAggregate(...expected);

            });

            it("Then both the inside entities receive it", () => {

                expect(entity1ReceivedMessages[entity1ReceivedMessages.length - 1]).to.deep.equal(expected);
                expect(entity2ReceivedMessages[entity2ReceivedMessages.length - 1]).to.deep.equal(expected);

            });

        });

        describe("When one of the entities sends an allowed outbound message", () => {

            const expected = [allowedOutboundMessage, "I'm very well thanks"];
            beforeEach(async () => {

                await entity2SendMessage(...expected);

            });

            it("Then both the inner entities receive the message", () => {

                const entity1Actual = entity1ReceivedMessages.find(([messageType]) => messageType === allowedOutboundMessage);
                expect(entity1Actual).to.deep.equal(expected);
                const entity2Actual = entity2ReceivedMessages.find(([messageType]) => messageType === allowedOutboundMessage);
                expect(entity2Actual).to.deep.equal(expected);

            });

            it("And the outside should also receive the message", () => {

                const actual = outsideReceivedMessages[outsideReceivedMessages.length - 1];
                expect(actual).to.deep.equal(expected);

            })

        });

    });

});