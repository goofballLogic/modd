import { yoyo } from "./catalog.js";

// message building
const type = Symbol("Message type");

const message = (messageType, props) => ({
    ...props,
    [type]: messageType
});

const messagePrototype = (messageType) => ({

    [Symbol.hasInstance]: obj => obj?.[type] === messageType

});

function messageBuilder(description) {

    const messageType = Symbol(description);
    const builder = props => message(messageType, props);
    Object.setPrototypeOf(builder, messagePrototype(messageType));
    return builder;

}

// taxonomy
const AddedToCart = messageBuilder("Added to cart");


// usage
const addedToCart = AddedToCart({ ...yoyo, quantity: 2 });

console.log(addedToCart.quantity); // 2
console.log(addedToCart.sku); // "KAY-123-YOLO"
console.log(addedToCart instanceof AddedToCart); // true
