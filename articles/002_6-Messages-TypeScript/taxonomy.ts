import { messageBuilder, voidMessageBuilder } from "./messages";
import { AddedToCartData, CartTotalsUpdatedData } from "./schemas";

export const AddedToCart = messageBuilder<AddedToCartData>("Added to cart");

export const CartTotalsUpdated = messageBuilder<CartTotalsUpdatedData>("Cart totals updated");

export const AtCheckout = voidMessageBuilder("At checkout");
