import "./cart/cart.js";
import ProductListing, { Messages as ProductListingMessages } from "./product-listing/product-listing.js";

(async function () {

    const productListing = ProductListing();
    const catalog = await fetchFakeCatalog();

    productListing(ProductListingMessages.catalogUpdated, catalog);

}());

async function fetchFakeCatalog() {

    const catalogResponse = await fetch("./fake-catalog.json");
    return (await catalogResponse.json()).items;

}