export default function Dump(name = "?") {
    return console.log.bind(console, name, "DUMP");
}