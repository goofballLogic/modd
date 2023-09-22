import { AddedToCart, AtCheckout } from "./taxonomy";
import { skippingRope, yoyo } from "./catalog";
import shopping from "./objects/shopping";

// 2 yoyos
shopping(AddedToCart({ ...yoyo, quantity: 2 }));

// 1 skpping rope
shopping(AddedToCart({ ...skippingRope, quantity: 1 }));

// checkout
shopping(AtCheckout());
