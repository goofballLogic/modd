export interface CartTotalsUpdatedData {
    items: number,
    total: number
};

export interface AddedToCartData {
    sku: string,
    price: number,
    quantity: number
};
