import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import Spawn from "../lib/spawn.js";

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
        const spawner = Spawn(spawnMessage, { dataParser: x => x.greeting }, AnEntity);

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

});