const type = Symbol("Message type");

const message = (messageType, props) => ({
    ...props,
    [type]: messageType
});

const messageBuilderPrototype = (messageType) => ({

    [Symbol.hasInstance]: obj => obj?.[type] === messageType

});

export function messageBuilder(description) {

    const messageType = Symbol(description);
    const builder = (props?) => message(messageType, props);
    Object.setPrototypeOf(builder, messageBuilderPrototype(messageType));
    return builder;

}
