import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import Filter from "../lib/filter.js";
import { Logged } from "../lib/log.js";

describe("Filter", () => {

    describe("Given an entity", () => {

        const entity = (messageType, messageData) => { entity.messages.push([messageType, messageData]); };

        beforeEach(() => {
            entity.messages = [];
        });

        describe("And a singleton filter", () => {

            const applesPurchased = Symbol("Apples purchased");
            const orangesPurchased = Symbol("Oranges purchased");

            const entityFilter = Filter(applesPurchased, entity);

            describe("When the filter receives messages of multiple types", () => {

                let received;

                beforeEach(async () => {

                    received = [].concat(
                        await entityFilter(applesPurchased, 1),
                        await entityFilter(orangesPurchased, 2),
                        await entityFilter(applesPurchased, 3),
                        await entityFilter(orangesPurchased, 4)
                    ).filter(x => x);

                });

                it("Then the entity should have only received the filtered messages", () => {

                    expect(entity.messages).to.deep.equal([
                        [applesPurchased, 1],
                        [applesPurchased, 3],
                    ]);

                });

                it("Then the allowed messages should be logged", () => {

                    expect(received).to.have.lengthOf(2);
                    expect(received[0]).deep.equal([
                        Logged,
                        {
                            level: "trace",
                            message: ["Allowing", applesPurchased],
                            source: "Filter entity"
                        }
                    ]);

                });

            });

        });

        describe("And a singleton filter with a name", () => {

            const applesPurchased = Symbol("Apples purchased");
            const orangesPurchased = Symbol("Oranges purchased");
            const entityFilter = Filter("applesPurchased -> entity", applesPurchased, entity);

            describe("When the filter receives messages of multiple types", () => {

                let output = [];
                beforeEach(async () => {
                    output = [];
                    output.push(...(await entityFilter(applesPurchased, 1) || []));
                    output.push(...(await entityFilter(orangesPurchased, 2) || []));
                });

                it("Then the allowed messages should be logged using the name", () => {

                    expect(output).to.have.lengthOf(1);
                    expect(output[0]).to.deep.equal(
                        [Logged, {
                            "level": "trace",
                            "source": "applesPurchased -> entity",
                            "message": ["Allowing", applesPurchased]
                        }]
                    );

                });
            });
        });

        describe("And a multi-filter", () => {

            const applesPurchased = Symbol("Apples purchased");
            const orangesPurchased = Symbol("Oranges purchased");
            const bananasPurchased = Symbol("Bananas purchased");

            const entityFilter = Filter([applesPurchased, bananasPurchased], entity);

            describe("When the filter receives multiple messages", () => {


                beforeEach(() => {
                    entityFilter(applesPurchased, 1);
                    entityFilter(orangesPurchased, 2);
                    entityFilter(bananasPurchased, 3);
                });

                it("Then the entity should have only received the filtered messages", () => {

                    expect(entity.messages).to.deep.equal([
                        [applesPurchased, 1],
                        [bananasPurchased, 3]
                    ]);

                });

            });

        });

    });

});