import { Cart } from "../factories/Cart";
import { Bus } from "../factories/Bus";
import { Checkout } from "../factories/Checkout";

export default Bus([
    Cart(),
    Checkout()
]);
