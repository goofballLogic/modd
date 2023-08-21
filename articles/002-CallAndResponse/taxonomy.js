export const Type = Symbol("Message type");

export const AddedToCart = Symbol("Added to cart");
export const AtCheckout = Symbol("Checkout");
export const CartTotals = Symbol("Cart totals");

export const Message = (type, props) => ({

    [Type]: type,
    ...props

});
