import Filter from "../lib/filter.js";
import { cartBehaviourRequested } from "./messages/cart.js";
import { shoppingPageRequested } from "./messages/navigation.js";
import { productListBehaviourRequested } from "./messages/product-listing.js";

export default () =>
    Filter(
        shoppingPageRequested,
        (_, { cart, productListing }) => [
            [productListBehaviourRequested, { productListing }],
            [cartBehaviourRequested, { cart }]
        ]
    );