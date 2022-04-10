import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import Outbound from "../src/entities/outbound.js";

describe("Outbound", () => {

    describe("Given an entity which broadcasts on an interval", () => {

        const heartbeat = Symbol("heartbeat");
        const heartbeatRequested = Symbol("heartbeat requested");
        const heartbeatStopRequested = Symbol("heartbeat stop requested");

        function Heartbeat(delay) {
            return Outbound(send => {
                let count = 0;
                function beat() {
                    count++;
                    send(heartbeat, count);
                }
                let counter;

                return (messageType, _) => {
                    switch (messageType) {
                        case heartbeatStopRequested:
                            clearInterval(counter);
                            break;
                        case heartbeatRequested:
                            clearInterval(counter);
                            counter = setInterval(beat, delay);
                            break;
                    }
                }
            });
        }

        let beater;

        beforeEach(() => {
            beater = new Heartbeat(10);
        });

        describe("When it receives a context", () => {

            let received;
            beforeEach(async () => {
                received = [];
                const receiver = (messageType, messageData) => {
                    received.push([messageType, messageData]);
                }
                await beater(receiver);
            });

            describe("And messages are collected for a period", () => {

                beforeEach(async () => {
                    await beater(heartbeatRequested);
                    try {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    } finally {
                        await beater(heartbeatStopRequested);
                    }
                });

                it("Then the expected messages are received by the context", () => {

                    // at least 1-9 are expected within the time allowed
                    expect(received).to.deep.include([heartbeat, 1]);
                    expect(received).to.deep.include([heartbeat, 9]);

                });

            });

        });

    });

    describe("Given an entity using a named outbound", () => {

        let received;
        let entity;
        beforeEach(() => {

            entity = Outbound("the entity", _send => (...args) => received.push(args));
            received = [];

        });

        describe("When a message is sent", () => {

            const messageType = Symbol("The message type");
            beforeEach(async () => {

                await entity(messageType, "hello");

            });

            it("Then the entity receives the message", () => {

                expect(received).to.have.lengthOf(1);
                expect(received[0]).to.deep.equal([messageType, "hello"]);

            });

        });

    });

    describe("Given an entity using outbound", () => {

        let received, triggerSend, entity;

        beforeEach(() => {

            entity = Outbound(send => {
                triggerSend = send;
                return (...args) => { received.push(args); };
            })
            received = [];

        });

        describe("When the entity sends an outbound message with a data object", () => {

            const outboundMessageType = Symbol("Outbound message");
            let outboundMessageData;
            beforeEach(() => {

                outboundMessageData = { message: "hello" };
                triggerSend(outboundMessageType, outboundMessageData);

            });

            describe("But the outbound message is sent back to the entity", () => {

                beforeEach(async () => {

                    await entity(outboundMessageType, outboundMessageData);

                });

                it("Then the entity should not receive the returned message", () => {

                    expect(received).to.have.lengthOf(0);

                });

            });

        });

    });

});