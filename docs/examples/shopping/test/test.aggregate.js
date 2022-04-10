import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import Aggregate from "../src/entities/aggregate.js";

describe("Aggregate", () => {

    describe("Given an aggregate with a child entity", () => {

        let testEntity;
        let testAggregate;

        beforeEach(() => {

            testEntity = entitySpy();
            testAggregate = Aggregate("Test aggregate", [testEntity]);

        });

        describe("When I send the aggregate a message", () => {

            const testMessage = Symbol("Test message");
            beforeEach(async () => {

                await testAggregate(testMessage, "hello");

            });

            it("Then the entity receives the message", () => {
                const [_mt, actualMessageData]
                    = testEntity.calls.find(([mt]) => mt === testMessage);
                expect(actualMessageData).to.equal("hello");
            });

        });

    });

    describe("Given an entity which responds to message A with message B", () => {

        let testEntity;
        const messageA = Symbol("Message A");
        const messageB = Symbol("Message B");

        beforeEach(() => {

            testEntity = entitySpyMapper(messageA, messageB, "b data");

        });

        describe("When I send message A to an aggregate containing the entity", () => {

            let testAggregate;

            beforeEach(async () => {

                testAggregate = Aggregate("Test aggregate: A->B", [testEntity]);
                await testAggregate(messageA, "data");

            });

            it("Then the entity receives Message B also", () => {
                const [_, actualMessageData] =
                    testEntity.calls.find(([mt]) => mt === messageB);
                expect(actualMessageData).to.equal("b data");
            });

        });

    });

    describe("Given an entity which responds to external events by emitting a message", () => {

        let eventfulEntity, normalEntity;
        const eventMessageType = Symbol("Event occurred");

        beforeEach(() => {
            eventfulEntity = EventfulEntity(eventMessageType);
            normalEntity = entitySpy();
            Aggregate(
                "Test aggregate: eventful",
                [eventfulEntity, normalEntity]
            );
        });

        describe("When an event gets triggered", () => {

            beforeEach(async () => {

                await eventfulEntity.triggerEvent("It's Christmas");

            });

            it("Then other entities in the same aggregate should be notified", () => {

                const [_, actualMessageData] =
                    normalEntity.calls.find(([mt]) => mt === eventMessageType);
                expect(actualMessageData).to.equal("It's Christmas");

            });

        })

    });

    describe("Given an aggregate with no child entities", () => {

        let testAggregate;
        beforeEach(() => {
            testAggregate = Aggregate("test aggregate");
        });

        describe("When a child entity is sent to the aggregate", () => {

            let received;
            const testEntity = (...args) => { received.push(args); }
            beforeEach(async () => {
                received = [];
                await testAggregate(testEntity);
            });

            it("Then the aggregate connects to the child entity", () => {

                expect(received).to.have.lengthOf(1);
                expect(received[0]).to.deep.equal([testAggregate]);

            });

            describe("And a message is sent via the aggregate", () => {

                const helloWorld = Symbol("Hello world");
                beforeEach(async () => {
                    await testAggregate(helloWorld, "hi!");
                });

                it("Then the child entity receives the message", () => {

                    const actualMessage = received.find(([mt]) => mt === helloWorld);
                    expect(actualMessage).to.deep.equal([helloWorld, "hi!"]);

                });

            });

        });

        describe("And it receives spawning entity which creates new entities", () => {

            const spawnMessage = Symbol("Spawn some entities please");

            let spawnedEntities;

            function spawner(messageType, messageData) {

                if (messageType === spawnMessage) {

                    const returnMessages = [];
                    for (let i = 0; i < messageData; i++) {

                        const spy = entitySpy();
                        spawnedEntities.push(spy);
                        returnMessages.push([spy]);

                    }
                    return returnMessages;

                }

            }

            beforeEach(async () => {

                await testAggregate(spawner);

            });

            describe("When the aggregate receives the spawn message", () => {

                beforeEach(async () => {

                    spawnedEntities = [];
                    await testAggregate(spawnMessage, 3);

                });

                it("Then it should have spawned the requested number of entities", () => {

                    expect(spawnedEntities).to.have.length(3);

                });

                describe("And when the entity receives some message", () => {

                    const someMessage = Symbol("Some message");
                    beforeEach(async () => {

                        await testAggregate(someMessage, "hello");

                    });

                    it("Then the spawned entities should all receive it", () => {

                        const findTheExpectedMessage = entity => entity.calls.find(([mt]) => mt === someMessage);
                        const actual = spawnedEntities.map(findTheExpectedMessage);
                        expect(actual).to.deep.equal([
                            [someMessage, "hello"],
                            [someMessage, "hello"],
                            [someMessage, "hello"],
                        ]);

                    });

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
    const handler = async (messageType) => {
        if (typeof messageType === "function")
            aggregate = messageType;
    };
    handler.triggerEvent = async function (eventName) {
        // send a message to the aggregate that an event occurred
        await aggregate(eventMessageType, eventName);
    };
    return handler;
}