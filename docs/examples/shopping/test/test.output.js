import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import Output from "../lib/output.js";

describe("Given an entity which broadcasts on an interval", () => {

    const heartbeat = Symbol("heartbeat");
    const heartbeatRequested = Symbol("heartbeat requested");
    const heartbeatStopRequested = Symbol("heartbeat stop requested");

    function Heartbeat(delay) {
        return Output(send => {
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