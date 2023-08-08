import { Sum } from "../factories/Sum.js";

export const xySum = Sum("calculator", {
    inputs: ["x", "y"],
    output: "sum"
});
