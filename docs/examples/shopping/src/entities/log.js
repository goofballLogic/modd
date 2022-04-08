export const Logged = Symbol("logged");
export const History = Symbol("history");

export const log = (level, source, ...message) => [
    Logged,
    { level, source, message }
];