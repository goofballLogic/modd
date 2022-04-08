import { cartBehaviourRequested } from "./cart.js";
import { productListBehaviourRequested } from "./product-listing.js";

export const shoppingPageRequested = Symbol("Shopping page requested");

export const behavioursRequestedFromShoppingPageRequested =
    (_messageType, messageData) => [
        productListBehaviourRequestedFromShoppingPageRequested(messageData),
        cartBehaviourRequestedFromShoppingPageRequested(messageData)
    ];

const productListBehaviourRequestedFromShoppingPageRequested =
    messageData => [productListBehaviourRequested, {
        productListing: messageData?.productListing
    }];

const cartBehaviourRequestedFromShoppingPageRequested =
    messageData => [cartBehaviourRequested, {
        cart: messageData?.cart
    }];