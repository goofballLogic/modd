const Name = Symbol("Animal's name");
const Speak = Symbol("Speak, please");
const speakMessage = { type: Speak };
const nameMessage = { type: Name };

function Animal(name) {

    return message => message?.type === Name
        ? name
        : undefined;

}

function Dog(name) {

    const base = Animal(name);
    return message => message?.type === Speak
        ? "woof"
        : base(message);

}

const spot = Dog("Spot");
console.log(spot(nameMessage), "says", spot(speakMessage)); // "Spot says woof"
