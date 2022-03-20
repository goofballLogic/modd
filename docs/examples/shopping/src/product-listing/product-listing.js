import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import Aggregate from "../../lib/aggregate.js";
import { productListBehaviourRequested } from "./product-listing-messages.js";
import { itemWasAddedToCart } from "../cart/cart-messages.js";
import { ContextPort } from "../../lib/dom-adapter.js";
import "./modd-product-listing.js";
import Outbound from "../../lib/outbound.js";
import Filter from "../../lib/filter.js";

export default function ProductListing() {

    return Outbound("product listing", send => {

        const productListingContext = Aggregate("product listing", [
            Filter(
                "Product list behaviour requested -> add context port",
                productListBehaviourRequested,
                connectToProductListingElement
            ),
            Filter(
                "parent <- product listing",
                itemWasAddedToCart,
                send
            )
        ]);

        function connectToProductListingElement(_, messageData) {

            // create a filtered port to the element
            const productListingElement = Filter(
                "Available products determined -> product listing element context port",
                availableProductsDetermined,
                ContextPort(
                    "product listing element context",
                    messageData.productListing,
                    send
                )
            );

            // add the port to our aggregate
            productListingContext(productListingElement);

        }

        return productListingContext;

    });

}