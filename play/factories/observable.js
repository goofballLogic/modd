const registeredHandlers = [];
const messageHandlers = [];

export function onRegistered(callback) {

    registeredHandlers.push(callback);

}

export function offRegistered(callback) {

    registeredHandlers.splice(registeredHandlers.indexOf(callback), 1);

}

export function onMessage(callback) {

    messageHandlers.push(callback);

}

export function offMessage(callback) {

    messageHandlers.push(callback);

}

export function Observable(id, observed) {

    registeredHandlers.forEach(handler => handler({ id }));
    return message => {

        messageHandlers.forEach(handler => handler({ id, message }));
        return observed(message);

    };

}
