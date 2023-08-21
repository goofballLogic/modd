import { Cart } from "./Cart.js";
import { AddedToCart, AtCheckout, Message } from "./taxonomy.js";
import { skippingRope, yoyo } from "./catalog.js";

const cart = Cart();

// 2 yoyos
cart(Message(AddedToCart, { ...yoyo, quantity: 2 }));

// 1 skpping rope
cart(Message(AddedToCart, { ...skippingRope, quantity: 1 }));

// checkout
const cartTotals = cart(Message(AtCheckout));
console.log(cartTotals.items, "items, total cost:", cartTotals.total);
