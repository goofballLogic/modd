import Filter from "../entities/filter.js";
import MessageCache from "../entities/message-cache.js";
import AlertBox from "./checkout-alert-box.js";
import { itemsInCartStatusUpdated } from "../messages/cart.js";
import { checkoutWasRequested } from "../messages/checkout.js";

export default () =>
    MessageCache(
        itemsInCartStatusUpdated,
        Filter(
            checkoutWasRequested,
            AlertBox()
        )
    );