const type = Symbol("Message type");

const voidMessage = (messageType: symbol) => ({
    [type]: messageType
} as object);

const message = <TProps>(messageType: symbol, props : TProps) => ({
    ...props,
    [type]: messageType
} as TProps);

const messageBuilderPrototype = (messageType: symbol) => ({

    [Symbol.hasInstance]: (obj: object | undefined) => obj?.[type] === messageType

});

export function voidMessageBuilder(description: string) : () => object {

    const messageType = Symbol(description);
    const builder = () => voidMessage(messageType);
    Object.setPrototypeOf(builder, messageBuilderPrototype(messageType));
    return builder;

}

export function messageBuilder<TProps>(description: string) : ((props: TProps) => TProps) {

    const messageType = Symbol(description);
    const builder = (props: TProps) => message(messageType, props);
    Object.setPrototypeOf(builder, messageBuilderPrototype(messageType));
    return builder;

}

export type MessageReceiver =
    (message: object) => object[] | object | void;
