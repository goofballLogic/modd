import Filter from "../entities/filter.js";
import { behavioursRequestedFromShoppingPageRequested, shoppingPageRequested } from "../messages/navigation.js";

export default () =>
    Filter(
        shoppingPageRequested,
        behavioursRequestedFromShoppingPageRequested
    );