import Aggregate from "../../lib/aggregate.js";
import Filter from "../../lib/filter.js";
import { cart, cartBehaviourRequested, cartUpdated, itemQuantityWasChanged, itemsInCartStatusUpdated, itemWasAddedToCart, itemWasRemovedFromCart } from "./cart-messages.js";
import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import Collection from "./collection.js";
import "./modd-cart.js";
import { checkoutWasRequested } from "../checkout/checkout-messages.js";
import { ContextPort } from "../../lib/dom-adapter.js";
import Outbound from "../../lib/outbound.js";
import { Logged } from "../../lib/log.js";

export default function Cart() {

    return Outbound(outside => {

        let context = () => { };

        return async (messageType, messageData) => {

            switch (messageType) {
                case cartBehaviourRequested:
                    context = Aggregate("cart context", [
                        Collection(),
                        Filter(
                            [
                                cartBehaviourRequested,
                                itemsInCartStatusUpdated
                            ],
                            ContextPort(
                                "cart-element",
                                messageData.cart,
                                (mt, md) => context(mt, md)
                            )
                        ),
                        Filter(
                            [
                                cartUpdated,
                                //itemsInCartStatusUpdated,
                                checkoutWasRequested,
                                Logged
                            ], outside)
                    ])
                    await context(cartBehaviourRequested, { enabled: true })
                    break;
                case itemWasAddedToCart:
                    await context(itemWasAddedToCart, messageData);
                    break;
                case availableProductsDetermined:
                    await context(availableProductsDetermined, messageData);
                    break;
            }
        }

    });

}