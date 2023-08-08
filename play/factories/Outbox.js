export function Outbox(name, callback) {

    const id = `Outbox[${name}]`;
    let mode = initialiser;
    let inner = console.error.bind(console, id, "Uninitialised");

    self.id = id
    return self;

    function self(message) {

        return mode(message);

    }

    function initialiser(outside) {

        if(typeof outside === "function") {

            // order matters here
            mode = passThrough;
            inner = callback(outside) || (() => {});

        }

    }

    function passThrough(message) {

        if(message !== "function") {

            return inner(message);

        }
    }

}
