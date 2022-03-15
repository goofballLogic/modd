import { ProductListingDispatcher } from "./modd-product-listing.js";
import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import Aggregate, { parentAggregateCreated } from "../../lib/aggregate.js";
import { productListing } from "./product-listing-messages.js";
import { itemWasAddedToCart } from "../cart/cart-messages.js";
import Forwarder from "../../lib/forwarder.js";

export default function ProductListing() {

    let parentAggregate;
    const forwardItemWasAddedToCartToParent = Forwarder(
        "product listing -> parent",
        itemWasAddedToCart,
        () => parentAggregate
    )

    const context = Aggregate("product listing", [
        ProductListingDispatcher,
        forwardItemWasAddedToCartToParent
    ]);


    return async (messageType, messageData) => {
        switch (messageType) {
            case availableProductsDetermined:
                const internalData = messageData.map(asProductListingProduct);
                await context(
                    productListing.availableProductsDetermined,
                    internalData
                )
                break;
            case parentAggregateCreated:
                parentAggregate = messageData;
                break;
        }
    }
}

function asProductListingProduct({
    author,
    imageUrl,
    listingId,
    price,
    stockLevel,
    title
}) {
    return {
        author,
        imageUrl,
        listingId,
        price,
        stockLevel,
        title
    };
}