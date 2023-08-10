import { Broadcast } from "./broadcast.js";
import { FeedbackFlat } from "./feedback-flat.js";
import { NoReentry } from "./no-reentry.js";

export function Aggregate(components) {

    const self = FeedbackFlat(
        Broadcast(
            components.map(NoReentry)
        )
    );
    // pass self as "outside"
    components.forEach(component => component(self));
    return self;

}
