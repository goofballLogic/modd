import { asArray } from "../maps/arrays.js";
import Filter from "./filter.js";
import { Logged } from "./log.js";

let spawnCounter = 1;

const asEntityMessage = entity => [entity];

export default function Spawn(activatingMessageTypes, options, Factory) {

    const name = (typeof options === "object" && options.name) || `Spawn ${spawnCounter++}`;
    const dataParser = typeof options === "function" ? options : options.dataParser || (x => x);

    return Filter(

        activatingMessageTypes,
        async (messageType, messageData) => {

            const parsedData = dataParser(messageData);
            // spawn the entities
            const spawned = asArray(Factory(parsedData));
            // pass the activation message to each entity
            const returned = [];
            spawned.forEach(entity =>
                returned.push(...asArray(entity(messageType, messageData)))
            );

            // return the entities and the output of the initial
            return [
                [Logged, {
                    source: name,
                    message: ["Spawned", spawned.id || `${Factory.name} entity`],
                    level: "debug"
                }],
                ...spawned.map(asEntityMessage),
                ...returned || []
            ]

        }

    );

}