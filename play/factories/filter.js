export const Outside = Symbol("Filter.Outside");

const isMatch = (filters, message) => filters.some(f => f(message));

const isOutsideObject = maybeFunction => typeof maybeFunction === "function";

const asFunction = filterOrType =>
    filterOrType === Outside ? isOutsideObject
        : typeof filterOrType === "function" ? filterOrType
            : matchByType(filterOrType);

const asArray = filters => Array.isArray(filters) ? filters : [filters];

function matchByType(type) {

    return x => x?.type === type;

}

export function Filter(filters, filtered) {


    filters = asArray(filters).map(asFunction);
    return message => isMatch(filters, message) ? filtered(message) : undefined;

}
