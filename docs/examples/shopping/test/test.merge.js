import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import Filter from "../lib/filter.js";
import { Logged } from "../lib/log.js";
import Merge from "../lib/merge.js";

describe("Merge", () => {

    describe("Given a merge with two accumulators", () => {

        let merge;
        const firstMessage = Symbol("First message");
        const secondMessage = Symbol("Second message");
        const resultMessage = Symbol("Result message");

        beforeEach(() => {
            merge = Merge({
                name: "Test merge",
                accumulators: [firstMessage, secondMessage],
                output: cache => [[
                    resultMessage,
                    [firstMessage, cache[firstMessage], secondMessage, cache[secondMessage]]
                ]]
            });
        });

        describe("When it receives both messages", () => {

            let received = [];
            let sent = [];
            beforeEach(async () => {
                received = [];
                sent = [];
                const testCase = async (mt, md) => {
                    sent.push(mt, md);
                    received.push(...await merge(mt, md));
                };
                await testCase(firstMessage, "hello");
                await testCase(secondMessage, "hello 2");
            });

            it("Then it should send back the merged output", () => {
                const actual = received.find(x => x[0] === resultMessage);
                expect(actual).to.deep.equal([resultMessage, sent]);
            });

        });

    });

    describe("Given a merge which emits one of its accumulators", () => {

        let merge;
        const firstMessage = Symbol("First message");
        const secondMessage = Symbol("Second message");

        beforeEach(() => {
            merge = Merge({
                name: "Test merge",
                accumulators: [firstMessage, secondMessage],
                output: _ => [[
                    firstMessage,
                    { "hello": "world" }
                ]]
            });
        });

        describe("When it receives its output message as input", () => {

            let received;

            beforeEach(async () => {
                await merge(firstMessage, "hello");
                const results1 = await merge(secondMessage, "hello 2");
                const outputMessage = results1.find(x => x[0] === firstMessage);
                received = await merge(...outputMessage);
            });

            it("Then it should not have processed the re-input message", () => {
                const actual = received.find(x => x[0] === firstMessage);
                expect(actual).to.be.undefined;
            });

        });

    });

});