export function Send(insideFactoryCallback) {

    let inside;
    return messageOrOutside =>
        inside
            ? inside(messageOrOutside)
            : initialiseInside(messageOrOutside);

    function initialiseInside(maybeOutside) {

        if(typeof maybeOutside === "function") {

            inside = insideFactoryCallback(maybeOutside);

        }

    }

}
