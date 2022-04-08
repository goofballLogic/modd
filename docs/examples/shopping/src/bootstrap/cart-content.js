import { cartUpdated, itemQuantityWasChanged, itemWasAddedToCart, itemWasRemovedFromCart } from "../messages/cart.js";
import QuantityStore from "../entities/quantity-store.js";

export default () =>
    QuantityStore({
        addedMessage: itemWasAddedToCart,
        removedMessage: itemWasRemovedFromCart,
        changedMessage: itemQuantityWasChanged,
        keyExtractor: x => x.itemId,
        emitMessage: cartUpdated
    });