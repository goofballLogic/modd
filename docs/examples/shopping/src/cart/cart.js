import { cart, cartBehaviourRequested, cartUpdated, itemQuantityWasChanged, itemsInCartStatusUpdated, itemWasAddedToCart, itemWasRemovedFromCart } from "./cart-messages.js";
import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import Collection from "./collection.js";
import "./modd-cart.js";
import { checkoutWasRequested } from "../checkout/checkout-messages.js";
import { ContextPort } from "../../lib/dom-adapter.js";
import Outbound from "../../lib/outbound.js";
import { Logged } from "../../lib/log.js";
import ContextAggregate from "../../lib/context-aggregate.js";
import Spawn from "../../lib/spawn.js";
import Filter from "../../lib/filter.js";
import Aggregate from "../../lib/aggregate.js";

export default function Cart() {

    const cartElementPortSpawner = Spawn(
        cartBehaviourRequested,
        x => x.cart,
        elementSelector =>
            Outbound(contextAggregate =>
                Filter([cartBehaviourRequested, cart.viewModelUpdated],
                    ContextPort("cart-element", elementSelector, contextAggregate)
                )
            )
    );

    function productListDetailUpsert(data) {
        const itemToPair = ({ listingId, title }) => [listingId, { title }];
        return data?.filter(x => x).map(itemToPair) || [];
    }

    function storeAddedCartItem({ itemId }, fetchExistingData) {
        const existingQuantity = fetchExistingData(itemId);
        const newQuantity = (existingQuantity || 0) + 1;
        return [[itemId, newQuantity]];
    }

    function changeStoredCartItemQuantity({ itemId, quantity }) {
        if (quantity === 0)
            return [[itemId]];
        else
            return [[itemId, quantity]];
    }

    function removeCartItem({ itemId }) {
        return [[itemId]];
    }

    function broadcastItemsInCart(state) {
        return {
            items: Object.fromEntries(
                Object.entries(state).map(
                    ([key, value]) => [key, { quantity: value }]
                )
            )
        };
    }

    function broadcastCartUpdated(state) {
        return {
            items: state
        }
    }

    function queryProductDetailsForItemsInCart(state, messageData) {
        state = state || {};
        const items = messageData?.items || {};
        return {
            items: Object.fromEntries(
                Object.keys(items).map(key => [key, state[key]])
            )
        };
    }

    return ContextAggregate(
        {
            name: "cart context",
            inbound: [
                cartBehaviourRequested,
                itemWasAddedToCart,
                availableProductsDetermined
            ],
            outbound: [
                cartUpdated,
                checkoutWasRequested,
                Logged
            ]
        },
        [
            //Collection(),
            Store({
                name: "cart's product detail list",
                mutations: [
                    [availableProductsDetermined, productListDetailUpsert]
                ],
                queries: [
                    [
                        itemsInCartStatusUpdated,
                        queryProductDetailsForItemsInCart,
                        cart.lookedUpProductDetailsForItemsInCart
                    ]
                ]
            }),
            Store({
                name: "cart contents",
                mutations: [
                    [itemWasAddedToCart, storeAddedCartItem],
                    [itemQuantityWasChanged, changeStoredCartItemQuantity],
                    [itemWasRemovedFromCart, removeCartItem]
                ],
                broadcasts: [
                    [itemsInCartStatusUpdated, broadcastItemsInCart],
                    [cartUpdated, broadcastCartUpdated]
                ]
            }),
            Merge({
                name: "Merge: items in cart",
                resetMessageType: itemsInCartStatusUpdated,
                accumulators: [itemsInCartStatusUpdated, cart.lookedUpProductDetailsForItemsInCart],
                output: cache => {

                    const [a, b] = [
                        cache[itemsInCartStatusUpdated],
                        cache[cart.lookedUpProductDetailsForItemsInCart]
                    ];

                    const merged = {
                        items: Object.fromEntries(
                            Object.keys(a.items)
                                .map(key =>
                                    [key, { ...a.items[key], ...b.items[key] }]
                                )
                        )
                    };
                    return [[cart.viewModelUpdated, merged]];
                }
            }),
            cartElementPortSpawner
        ]
    );

}

function Merge({ name, resetMessageType, accumulators, output }) {

    let cache = {};
    const allowedMessages = Array.from(new Set([resetMessageType, ...accumulators]));

    return Filter(`${name} filter`, allowedMessages, async (messageType, messageData) => {

        if (messageType === resetMessageType)
            cache = {};

        if (accumulators.includes(messageType))
            cache[messageType] = messageData;

        if (accumulators.every(a => a in cache)) {

            return await renderOutputs();

        }

    });

    async function renderOutputs() {

        const results = [].concat(await output(cache) || []);
        return [
            [
                Logged,
                {
                    source: name,
                    message: ["Merged and dispatching", ...results.map(x => x[0])],
                    level: "trace"
                }
            ],
            ...results
        ];

    }

}

function Store({ name, mutations, broadcasts, queries }) {

    const state = new Map();

    function fetchExistingData(key) {
        return key ? state.get(key) : Array.from(state.entries());
    }

    const mutationOperations = new Map();
    if (mutations) {

        for (const [mutationMessageType, mutationHandler] of mutations)
            mutationOperations.set(
                mutationMessageType,
                async (messageData) => {
                    const pairs = await mutationHandler(messageData, fetchExistingData);
                    for (const [key, value] of pairs) {
                        if (value === undefined)
                            state.delete(key);
                        else
                            state.set(key, value);
                    }
                }
            );
    }

    const broadcastOperations = new Set();
    if (broadcasts) {

        for (const [broadcastMessageType, messageDataFactory] of broadcasts) {
            broadcastOperations.add([
                broadcastMessageType,
                () => messageDataFactory(Object.fromEntries(state.entries()))
            ]);
        }

    }

    const queryOperations = new Map();
    if (queries) {

        for (const [queryMessageType, queryTransform, outputMessageType] of queries) {
            queryOperations.set(
                queryMessageType,
                async (messageData) => {
                    const rendered = await queryTransform(Object.fromEntries(state), messageData);
                    return [outputMessageType, rendered];
                }
            )
        }

    }

    const mutationMessages = Array.from(mutationOperations.keys());
    const queryMessages = Array.from(queryOperations.keys());

    return Outbound(outside =>
        Aggregate(`${name} internal`, [
            Filter(mutationMessages, async (messageType, messageData) => {
                const mutation = mutationOperations.get(messageType);
                await mutation(messageData);
                const output = [
                    [Logged, {
                        source: name,
                        message: ["Mutation due to", messageType],
                        level: "trace"
                    }]
                ];
                for (const [broadcastMessageType, broadcast] of broadcastOperations) {

                    output.push(
                        [broadcastMessageType, await broadcast()],
                        [Logged, {
                            source: name,
                            message: ["Broadcasting", broadcastMessageType],
                            level: "trace"
                        }]
                    );

                }
                return output;

            }),
            Filter(queryMessages, async (messageType, messageData) => {
                const query = queryOperations.get(messageType);
                const outputMessage = await query(messageData);
                await outside(...outputMessage);
            }),
            Filter([Logged, itemsInCartStatusUpdated, cartUpdated], outside)
        ])
    );

}