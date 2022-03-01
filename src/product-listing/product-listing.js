import "./mood-example-product-listing.js";
import { catalogUpdated } from "./messages.js";

export const Messages = {
    catalogUpdated
};

export default function ProductListing() {
    return async (mType, mData) => {
        switch (mType) {
            case Messages.catalogUpdated:
                console.log(mType, mData);
                break;
        }
    };
}