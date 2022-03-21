import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import Aggregate from "../lib/aggregate.js";

describe("Aggregate", () => {

    describe("Given an aggregate with a child entity", function () {

        let testEntity;
        let testAggregate;

        beforeEach(function () {

            testEntity = entitySpy();
            testAggregate = Aggregate("Test aggregate", [testEntity]);

        });

        describe("When I send the aggregate a message", function () {

            const testMessage = Symbol("Test message");
            beforeEach(async function () {

                await testAggregate(testMessage, "hello");

            });

            it("Then the entity receives the message", function () {
                expect(testEntity.calls.length).to.equal(4);

                const [actualMessageType, actualMessageData] = testEntity.calls[3];
                expect(actualMessageType).to.equal(testMessage);
                expect(actualMessageData).to.equal("hello");
            });

        });

    });

    describe("Given an entity which responds to message A with message B", function () {

        let testEntity;
        const messageA = Symbol("Message A");
        const messageB = Symbol("Message B");

        beforeEach(function () {

            testEntity = entitySpyMapper(messageA, messageB, "b data");

        });

        describe("When I send message A to an aggregate containing the entity", function () {

            let testAggregate;

            beforeEach(async function () {

                testAggregate = Aggregate("Test aggregate: A->B", [testEntity]);
                await testAggregate(messageA, "data");

            });

            it("Then the entity receives Message B also", function () {
                expect(testEntity.calls.length).to.equal(6);

                const [actualMessageType, actualMessageData] = testEntity.calls[5];
                expect(actualMessageType).to.equal(messageB);
                expect(actualMessageData).to.equal("b data");
            });

        });

    });

    describe("Given an entity which responds to external events by emitting a message", function () {

        let eventfulEntity, normalEntity;
        const eventMessageType = Symbol("Event occurred");

        beforeEach(function () {
            eventfulEntity = EventfulEntity(eventMessageType);
            normalEntity = entitySpy();
            Aggregate(
                "Test aggregate: eventful",
                [eventfulEntity, normalEntity]
            );
        });

        describe("When an event gets triggered", function () {

            beforeEach(async function () {
                await eventfulEntity.triggerEvent("It's Christmas");
            });

            it("Then other entities in the same aggregate should be notified", function () {
                expect(normalEntity.calls.length).to.equal(4);

                const [messageType, messageData] = normalEntity.calls[3];
                expect(messageType).to.equal(eventMessageType);
                expect(messageData).to.equal("It's Christmas");
            });
        })

    });

    describe("Given an aggregate with no child entities", function () {

        let testAggregate;
        beforeEach(() => {
            testAggregate = Aggregate("test aggregate");
        });

        describe("When a child entity is sent to the aggregate", function () {

            let received;
            const testEntity = (...args) => { received.push(args); }
            beforeEach(async () => {
                received = [];
                await testAggregate(testEntity);
            });

            describe("And a message is sent via the aggregate", () => {

                const helloWorld = Symbol("Hello world");
                beforeEach(async () => {
                    await testAggregate(helloWorld, "hi!");
                });

                it("Then the child entity receives the message", () => {

                    expect(received).to.have.lengthOf(3);
                    expect(received[2]).to.deep.equal([
                        helloWorld,
                        "hi!"
                    ]);

                });

            });
        });
    });

});

function entitySpy() {
    const spy = async (...args) => { spy.calls.push(args); };
    spy.calls = [];
    return spy;
}

function entitySpyMapper(fromMessageType, toMessageType, toMessageData, ...args) {
    const spy = async (messageType, messageData) => {
        spy.calls.push([messageType, messageData, ...args]);
        if (messageType === fromMessageType) {
            return [[toMessageType, toMessageData]];
        }
    };
    spy.calls = [];
    return spy;
}

function EventfulEntity(eventMessageType) {
    let aggregate;
    const handler = async (messageType, messageData) => {
        if (typeof messageType === "function")
            aggregate = messageType;
    };
    handler.triggerEvent = async function (eventName) {
        // send a message to the aggregate that an event occurred
        await aggregate(eventMessageType, eventName);
    };
    return handler;
}