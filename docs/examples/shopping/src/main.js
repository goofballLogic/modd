import { shoppingPageRequested } from "./messages/navigation.js";
import Domain from "./bootstrap/domain.js";

const domain = Domain();

domain(
    shoppingPageRequested,
    {
        cart: "modd-cart",
        productListing: "modd-product-listing"
    }
);