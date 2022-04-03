export const availableProductsDetermined = Symbol("Available products determined");


const adaptProduct =
    (product, cartUpdatedItems) => ({
        ...product,
        stockLevel: product.stockLevel - (cartUpdatedItems[product.listingId] || 0)
    });

export const mergeAvailableProductsAndCartUpdated =
    (availableProducts, cartUpdatedItems) => [
        availableProductsDetermined,
        availableProducts.map(p => adaptProduct(p, cartUpdatedItems))
    ];
