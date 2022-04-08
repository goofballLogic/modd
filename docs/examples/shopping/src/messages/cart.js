export const cartBehaviourRequested = Symbol("Cart behaviour requested");
export const itemsInCartStatusUpdated = Symbol("Items 'in-cart' status updated");
export const itemWasAddedToCart = Symbol("Item was added to cart");
export const cartUpdated = Symbol("Cart updated");
export const itemQuantityWasChanged = Symbol("Item quantity was changed");
export const itemWasRemovedFromCart = Symbol("Item was removed from cart");

export const elementSelectorFromCartBehaviourRequested =
    x => x.cart;

export const buildItemsInCartStatusUpdated = (cartUpdatedData, productList) =>
    [
        itemsInCartStatusUpdated,
        {
            items: buildItems(cartUpdatedData, productList)
        }
    ];

const findProductByItemId = (productList, itemId) =>
    productList.find(item => item.listingId === itemId)

const buildItems = (cartUpdatedData, productList) => Object
    .entries(cartUpdatedData?.items || {})
    .map(([itemId, quantity]) => ({
        itemId,
        quantity,
        ...findProductByItemId(productList, itemId)
    }));