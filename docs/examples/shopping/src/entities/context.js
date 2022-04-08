import Outbound from "./outbound.js";
import Filter from "./filter.js";

export default function Context(
    {
        name,
        inbound = [],
        outbound = []
    },
    insideFactory
) {
    return Outbound(
        name,
        outside => {
            const filteredOutside = Filter(outbound, outside);
            const inside = insideFactory(filteredOutside);
            return Filter(inbound, inside);
        }
    );
}