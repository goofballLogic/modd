import Outbound from "./outbound.js";
import Filter from "./filter.js";

export default function Context(
    name,
    allowedInboundMessages,
    allowedOutboundMessages,
    insideFactory
) {
    return Outbound(
        name,
        outside => {
            const filteredOutside = Filter(allowedOutboundMessages, outside);
            const inside = insideFactory(filteredOutside);
            return Filter(allowedInboundMessages, inside);
        }
    );
}