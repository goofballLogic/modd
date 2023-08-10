import { Aggregate } from "./factories/aggregate.js";
import { Filter, Outside } from "./factories/filter.js";
import { Observable, onMessage, onRegistered } from "./factories/observable.js";
import { Send } from "./factories/send.js";
import { WhenIdle } from "./factories/when-idle.js";

onRegistered(
    WhenIdle(
        ({ id }) => console.warn("Registered:", id)
    )
);

onMessage(
    WhenIdle(
        Filter(
            ({ message }) => !!message.type,
            ({ id, message }) => console.warn(message.type, ">>>", id)
        )
    )
);

const INPUT = Symbol("input");
const OUTPUT = Symbol("output");
const OutputMessage = value => ({ type: OUTPUT, value });
const InputMessage = value => ({ type: INPUT, value });

const inputDoubler = Filter(
    INPUT,
    Observable(
        "inputDoubler",
        input => OutputMessage(input.value * 2)
    )
);
const consoleLogger = Filter(
    OUTPUT,
    Observable(
        "consoleLogger",
        output => console.log(output.value)
    )
);
const delayMessage = Filter(
    Outside,
    Observable(
        "delayMessage",
        Send(outside => {
            setTimeout(() => outside(OutputMessage("Wake up!")), 2000);
        })
    )
);

WhenIdle(
    Observable(
        "main",
        Aggregate([
            inputDoubler,
            consoleLogger,
            delayMessage
        ])
    )
)(InputMessage(2));

console.log("Program complete");

