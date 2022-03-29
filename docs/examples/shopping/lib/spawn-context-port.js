import { ContextPort } from "./dom-adapter.js";
import Outbound from "./outbound.js";
import Spawn from "./spawn.js";
import Filter from "./filter.js";

export function SpawnContextPort(activatingMessages, findElementSelector, portName, allowedInboundMessages) {
    return Spawn(
        activatingMessages,
        findElementSelector,
        elementSelector =>
            Outbound(outside =>
                Filter(
                    allowedInboundMessages,
                    ContextPort(portName, elementSelector, outside)
                )
            )
    );
}
