import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import Aggregate from "../../lib/aggregate.js";
import { productListBehaviourRequested } from "./product-listing-messages.js";
import { itemWasAddedToCart } from "../cart/cart-messages.js";
import { ContextPort } from "../../lib/dom-adapter.js";
import "./modd-product-listing.js";
import Outbound from "../../lib/outbound.js";
import Filter from "../../lib/filter.js";
import { Logged } from "../../lib/log.js";

export default function ProductListing() {

    return Outbound("product listing", outside => {

        const productListing = Aggregate("product listing", [
            Filter(
                "Product list behaviour requested -> add context port",
                productListBehaviourRequested,
                (_, messageData) => {

                    // create a filtered port to the element
                    const productListingElement = Filter(
                        "Available products determined -> product listing element context port",
                        availableProductsDetermined,
                        ContextPort(
                            "product listing element context",
                            messageData.productListing,
                            outside
                        )
                    );
                    // add the port to our aggregate
                    productListing(productListingElement);

                }
            ),
            Filter(
                "outside <- product listing",
                [itemWasAddedToCart, Logged],
                outside
            )
        ]);

        return Filter(
            [productListBehaviourRequested, availableProductsDetermined],
            productListing
        );

    });

}