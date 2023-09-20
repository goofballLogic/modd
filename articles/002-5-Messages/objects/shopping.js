import { Cart } from "../factories/Cart.js";
import { Bus } from "../factories/Bus.js";
import { Checkout } from "../factories/Checkout.js";

export default Bus([
    Cart(),
    Checkout()
]);
