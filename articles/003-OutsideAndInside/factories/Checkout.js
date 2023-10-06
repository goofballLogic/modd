import { AtCheckout, CartTotalsUpdated } from "../taxonomy.js";

export function Checkout() {

    let latestTotals;

    return message => {

        switch (true) {
            case message instanceof CartTotalsUpdated:
                latestTotals = message;
                break;
            case message instanceof AtCheckout:
                logCartTotals(latestTotals);
                break;
        }

    };

}

function logCartTotals({ items, total }) {

    console.log(items, "items, total cost:", total);

}
