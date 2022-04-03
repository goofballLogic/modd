import { log } from "./log.js";
import Filter from "./filter.js";

export default function FetchResource({
    name,
    fetchMessageType,
    urlBuilder,
    outputMessageType,
    outputMessageTransform
}) {

    return Filter(fetchMessageType, async (_, messageData) => {
        const url = urlBuilder ? await urlBuilder(messageData) : messageData;
        const resp = await fetch(url);
        const isJSON = resp.headers.get("content-type").match(/[\/\+]json(;|$)/i);
        const data = isJSON ? await resp.json() : await resp.text();
        const transformedData = outputMessageTransform ? await outputMessageTransform(data) : data;
        return [
            log(
                "debug",
                name,
                "for", url.toString(),
                "=>", resp.status
            ),
            [outputMessageType, transformedData]
        ];
    });

}