import Filter from "./filter.js";
import { Logged } from "./log.js";

let spawnCounter = 1;

export default function Spawn(activatingMessageTypes, options, Factory) {

    const name = (typeof options === "object" && options.name) || `Spawn ${spawnCounter++}`;
    const dataParser = typeof options === "function" ? options : options.dataParser || (x => x);

    return Filter(
        activatingMessageTypes,
        (_, messageData) => {

            const parsedData = dataParser(messageData);
            const spawned = Factory(parsedData);
            return [
                [Logged, {
                    source: name,
                    message: ["Spawned", spawned.id || `${Factory.name} entity`],
                    level: "debug"
                }],
                [spawned]
            ]

        }

    );

}