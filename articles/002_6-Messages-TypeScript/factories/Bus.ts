import { MessageReceiver } from "../messages";

export function Bus(components: MessageReceiver[]) {

    const queue: object[] = [];

    return (message: object) => {

        queue.push(message);
        processMessageQueue();

    };

    function processMessageQueue() {

        while(queue.length) {

            // next message to dispatch
            const next = queue.shift();

            if (typeof next === "object") {

                // call all components with the next message;
                const messages = components.flatMap(component => component(next));

                // push all resulting messages on to the queue
                for (let message of messages) {
                    if(message !== undefined) {
                        queue.push(message);
                    }
                }

            }

        }

    }

}
