export const productListBehaviourRequested = Symbol("Product list behaviour requested");
export const itemsForSaleListed = Symbol("Items for sale listed");

export const elementSelectorFromProductListBehaviourRequested =
    x => x.productListing;