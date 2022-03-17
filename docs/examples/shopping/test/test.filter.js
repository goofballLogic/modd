import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import Filter from "../lib/filter.js";

describe("Given an entity", () => {

    const entity = (messageData, messageType) => { entity.messages.push([messageData, messageType]); };

    beforeEach(() => {
        entity.messages = [];
    });

    describe("And a singleton filter", () => {

        const applesPurchased = Symbol("Apples purchased");
        const orangesPurchased = Symbol("Oranges purchased");

        const entityFilter = Filter(applesPurchased, entity);

        describe("When the filter receives messages of multiple types", () => {

            beforeEach(() => {
                entityFilter(applesPurchased, 1);
                entityFilter(orangesPurchased, 2);
                entityFilter(applesPurchased, 3);
                entityFilter(orangesPurchased, 4);
            });

            it("Then the entity should have only received the filtered messages", () => {

                expect(entity.messages).to.deep.equal([
                    [applesPurchased, 1],
                    [applesPurchased, 3]
                ]);

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
