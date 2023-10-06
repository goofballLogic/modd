const yoyo = {
    sku: "123412344",
    price: 10.99,
}

const addedToCartType = "AddedToCart"

type AddedToCartType = typeof addedToCartType

interface AddedToCart {
    _tag: AddedToCartType
    sku: string
    price: number
    quantity: number
}

function isAddedToCart(thing: object): thing is AddedToCart {
    return (thing as AddedToCart)._tag === addedToCartType
}

const addedToCart: AddedToCart = { _tag: addedToCartType, ...yoyo, quantity: 2 }
console.log(isAddedToCart(addedToCart)) // true

// but...

const removedFromCartType = "RemovedFromCart"

type RemovedFromCartType = typeof removedFromCartType

interface RemovedFromCart {
    _tag: RemovedFromCartType
    sku: string
    price: number
    quantity: number
}

const removedFromCart: RemovedFromCart = { _tag: removedFromCartType, ...yoyo, quantity: 2 }
console.log(isAddedToCart(removedFromCart)); // false :)
