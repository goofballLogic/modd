export const cartBehaviourRequested = Symbol("Cart behaviour requested");
export const itemsInCartStatusUpdated = Symbol("Items 'in-cart' status updated");
export const itemWasAddedToCart = Symbol("Item was added to cart");
export const cartUpdated = Symbol("Cart updated");
export const itemQuantityWasChanged = Symbol("Item quantity was changed");
export const itemWasRemovedFromCart = Symbol("Item was removed from cart");
export const cart = {
    checkoutRequested: Symbol("Cart: checkout requested"),
    lookedUpProductDetailsForItemsInCart: Symbol("Cart: looked up product details for items in cart"),
    viewModelUpdated: Symbol("Cart: view model updated")
};