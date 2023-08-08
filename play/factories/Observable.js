export const Observable_Registered = Symbol("Observable.Registered");
export const Observable_Message_Received = Symbol("Observable.Message.Received");

const broadcastIdleOptions = { timeout: 500 };

export function Observable(observee) {

    broadcastObservable_Registered(observee);
    const self =
        typeof observee === "function"
            ? (message) => {

                broadcastObservable_Message_Received(observee, message);
                return observee(message);

            }
            : {};
    self.id = observee.id;
    return self;

}

function broadcastObservable_Message_Received(observee, message) {

    broadcast({ observee, message, symbol: Observable_Message_Received });

}

function broadcastObservable_Registered(observee) {

    broadcast({ observee, symbol: Observable_Registered });

}

function broadcast({ observee, message, symbol }) {

    const when = Date.now();
    requestIdleCallback(() => {

        const detail = { id: observee.id, when, message };
        const event = new CustomEvent(symbol.description, { detail });
        document.dispatchEvent(event);

    }, broadcastIdleOptions);

}


