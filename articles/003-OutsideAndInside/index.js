import { AddedToCart, AtCheckout } from "./taxonomy.js";
import { skippingRope, yoyo } from "./catalog.js";
import shopping from "./objects/shopping.js";

// 2 yoyos
shopping(AddedToCart({ ...yoyo, quantity: 2 }));

// 1 skpping rope
shopping(AddedToCart({ ...skippingRope, quantity: 1 }));

// checkout
shopping(AtCheckout());
