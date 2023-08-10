const LIMIT = 1000;

export function FeedbackFlat(inner) {

    return async message => {

        let queue = [message];
        while (queue.length) {

            const next = queue.shift();
            const results = await inner(next);
            if (results) {

                if (Array.isArray(results)) {

                    queue.push(...results);

                } else {

                    queue.push(results);

                }
                if (queue.length > LIMIT) throw new Error("Stack overflow");

            }

        }

    };

}
