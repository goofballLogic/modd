describe("Given a Once entity", () => {

    const greetingReceived = Symbol("Greeting received");
    let received;
    const recorder = (...args) => { received.push(args); };
    const allowGreetingReceived = Once(greetingReceived, recorder);

    describe("When a message is sent to the Once", () => {

        beforeEach(async () => {
            received = [];
            await allowGreetingReceived(greetingReceived, "hello world");
        });

        describe("But then the message is sent back to the Once", () => {

            let output = [];
            beforeEach(async () => {
                const returned = await allowGreetingReceived(greetingReceived, "hello world") || [];
                output.push(...returned);
            });

            it("Then the message is not be allowed through the Once a second time", () => {

                expect(received).to.have.lengthOf(1);

            });

            it("And the Once logs that it blocked sending the message a second time", () => {

                expect(output).to.have.lengthOf(1);
                expect(output[0]).to.deep.equal([
                    Logged,
                    {
                        level: "info",
                        message: ["Blocked: Apples purchased (attempt 2)"],
                        "source": "applesPurchased -> entity"
                    }
                ]);

            });

        });

    });

});