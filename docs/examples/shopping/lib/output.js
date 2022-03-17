export default function Output(inside) {

    let outsideProxy = () => { };
    const insideProxy = inside((...args) => outsideProxy(...args));

    return (...args) => {
        if (typeof args[0] === "function") {
            outsideProxy = args[0];
        }
        return insideProxy(...args);
    };
}