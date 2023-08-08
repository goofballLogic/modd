import { Observable } from "./Observable.js";
export const SumResult = Symbol("Sum.Result");

export function Sum(name, { inputs, output }) {

    const self = message => {

        if(inputs.some(k => k in message)) {

            try {

                return {
                    type: SumResult,
                    [output]: inputs
                        .map(field => message[field])
                        .map(x => parseFloat(x))
                        .filter(x => typeof x === "number" && !isNaN(x))
                        .reduce((a,b) => a + b),
                    sender: self.id
                };

            } catch(_) {

                return {};

            }

        }

    };
    self.id = `Sum[${name}]`;
    return Observable(self);

}
