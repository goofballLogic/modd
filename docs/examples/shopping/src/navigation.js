import { shoppingPageRequested } from "./messages/navigation.js";
import { cartBehaviourRequested } from "./messages/cart.js";
import { productListBehaviourRequested } from "./messages/product-listing.js";
import Filter from "../lib/filter.js";

export default function Navigation() {

    return Filter(
        shoppingPageRequested,
        (_, messageData) => {
            const { cart, productListing } = messageData;
            return [
                [productListBehaviourRequested, { productListing }],
                [cartBehaviourRequested, { cart }]
            ];
        });

}