export function Bus(components) {

    const queue: unknown[] = [];
    return message => {

        queue.push(message);
        processMessageQueue();

    };

    function processMessageQueue() {

        while(queue.length) {

            // next message to dispatch
            const next = queue.shift();

            // call all components with the next message;
            const messages = components.flatMap(component => component(next));

            // push all resulting messages on to the queue
            queue.push(...messages.filter(x => x));

        }

    }

}
