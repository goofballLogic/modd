export function Broadcast(recipients) {

    return async message => {

        const sending = recipients.map(recipient => recipient(message));
        const results = await Promise.all(sending);
        return results.flatMap(x => x).filter(x => x);

    }

}
