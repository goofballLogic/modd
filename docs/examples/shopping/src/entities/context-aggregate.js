import Aggregate from "./aggregate.js";
import Context from "./context.js";

let contextAggregateCount = 1;

export default function ContextAggregate(contextOptions, aggregateComponents) {

    const name = contextOptions?.name || `Context aggregate ${contextAggregateCount++}`;

    return Context(
        {
            name,
            ...contextOptions
        },
        send => Aggregate(
            `Aggregate for ${name}`,
            [
                ...aggregateComponents,
                send
            ]
        )
    );

}