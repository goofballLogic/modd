import Filter from "./filter.js";

export default function Observe(allowedMessages) {

    window.observed = [];
    return Filter(allowedMessages, (messageType, messageData) => {

        window.observed.push([messageType, messageData]);

    });

}