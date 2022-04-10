import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import Spawn from "../src/entities/spawn.js";

describe("Spawn", () => {

    let expected;

    function AnEntity(...args) {
        const entity = () => { };
        entity.factoryParameters = args;
        expected = entity;
        return entity;
    }

    describe("Given a spawn entity", () => {

        const spawnMessage = Symbol("Ready player 1");
        let spawner
        beforeEach(() => {
            spawner = Spawn(spawnMessage, { dataParser: x => x.greeting }, AnEntity);
        });

        describe("When it receives the activation message", () => {

            let received;
            beforeEach(async () => {

                received = await spawner(spawnMessage, { greeting: "hello world" });

            });

            it("Then it spawns an entity with the passed data", () => {

                const actual = received[received.length - 1];
                expect(actual).to.eql([expected]);
                expect(actual[0].factoryParameters).to.deep.equal(["hello world"]);

            });

        });

    });

    describe("When I create a spawn entity using only a data parser", () => {

        let received;
        let caught;
        beforeEach(async () => {
            try {
                const spawnMessage = Symbol("Ready player 1");
                const spawner = Spawn(spawnMessage, x => x.greeting, AnEntity);
                received = await spawner(spawnMessage, { greeting: "hello world 2" });
            } catch (err) {
                caught = err;
            }

        });

        it("Then it processes the activation message as normal", () => {

            expect(caught).to.be.undefined;
            const actual = received[received.length - 1];
            expect(actual[0].factoryParameters).to.deep.equal(["hello world 2"]);

        });

    });

    describe("Given a multi-entity", () => {

        let expecteds = [];
        const someMessage = Symbol("Some message");

        function AMultiEntity() {
            expecteds = [
                (mt, _md) => [[someMessage, `1 got ${mt.description}`]],
                (mt, _md) => [[someMessage, `2 got ${mt.description}`]],
                (mt, _md) => [[someMessage, `3 got ${mt.description}`]]
            ];
            return expecteds;
        }

        describe("When a spawner for the multi-entry receives the spawn message", () => {

            const spawnMessage = Symbol("Activate please");
            let received;
            beforeEach(async () => {
                const spawner = Spawn(spawnMessage, x => x, AMultiEntity);
                received = await spawner(spawnMessage);
            });


            it("Then it should receive the three spawned entities back", () => {

                const isEntityMessage = ([x]) => typeof x === "function";
                const entityMessages = received.filter(isEntityMessage);
                expect(entityMessages).to.have.length(3);

            });

            it("Then it should receive the output of the three spawned entities receiving the spawn message", () => {

                const isOutputMessage = ([x]) => x === someMessage;
                const outputMessages = received.filter(isOutputMessage);
                expect(outputMessages).to.deep.equal([
                    [someMessage, "1 got Activate please"],
                    [someMessage, "2 got Activate please"],
                    [someMessage, "3 got Activate please"]
                ]);

            });

        });

    });

});