import { shoppingPageRequested } from "./messages/navigation.js";
import { cartBehaviourRequested } from "./messages/cart.js";
import { productListBehaviourRequested } from "./messages/product-listing.js";
import ContextAggregate from "../lib/context-aggregate.js";
import RequestComponents from "./navigation-request-components.js";

export default () =>
    ContextAggregate(
        {
            name: "navigation",
            inbound: [
                shoppingPageRequested
            ],
            outbound: [
                productListBehaviourRequested,
                cartBehaviourRequested
            ]
        },
        [
            RequestComponents()
        ]
    );