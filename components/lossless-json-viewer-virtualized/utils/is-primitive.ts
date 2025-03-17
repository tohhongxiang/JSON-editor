import { isLosslessNumber } from "lossless-json";
import { JSONPrimitive, JSONValue } from "../types";

export default function isPrimitive(x: JSONValue): x is JSONPrimitive {
    return (
        typeof x === "string" ||
        typeof x === "boolean" ||
        typeof x === "number" ||
        x === null ||
        isLosslessNumber(x)
    );
}
