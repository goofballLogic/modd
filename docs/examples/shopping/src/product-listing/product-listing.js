import { availableProductsDetermined } from "../inventory/inventory-messages.js";
import Aggregate from "../../lib/aggregate.js";
import { productListBehaviourRequested } from "./product-listing-messages.js";
import { itemWasAddedToCart } from "../cart/cart-messages.js";
import { ContextPort } from "../../lib/dom-adapter.js";
import "./modd-product-listing.js";
import Permit from "../../lib/filter.js";
import { Logged } from "../../lib/log.js";
import Context from "../../lib/context.js";

export default function ProductListing() {

    return Context(
        "product listing",
        [
            productListBehaviourRequested,
            availableProductsDetermined
        ],
        [
            itemWasAddedToCart,
            Logged
        ],
        outside => {

            const productListing =
                Aggregate(
                    "product listing",
                    [
                        Permit(
                            productListBehaviourRequested,
                            ProductListingElement
                        ),
                        outside
                    ]
                );

            function ProductListingElement(_, messageData) {
                return [[
                    Permit(
                        availableProductsDetermined,
                        ContextPort(
                            "product listing context",
                            messageData.productListing,
                            productListing
                        )
                    )
                ]];
            }

            return productListing;

        });



}