import { MessageReceiver } from "../messages";
import { CartTotalsUpdatedData } from "../schemas";
import { AtCheckout, CartTotalsUpdated } from "../taxonomy";

export function Checkout() : MessageReceiver {

    let latestTotals : CartTotalsUpdatedData;

    return (message: object) => {

        switch (true) {
            case message instanceof CartTotalsUpdated:
                latestTotals = message as CartTotalsUpdatedData;
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
