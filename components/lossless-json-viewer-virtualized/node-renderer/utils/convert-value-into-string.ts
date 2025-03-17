import { isLosslessNumber, stringify } from "lossless-json";
import { JSONValue } from "../../types";

export default function convertValueIntoString(value: JSONValue) {
    if (isLosslessNumber(value)) {
        return value.value;
    }

    if (value === null) {
        return "null";
    }

    if (typeof value === "boolean") {
        if (value) {
            return "true";
        }

        return "false";
    }

    if (typeof value === "string") {
        return value;
    }

    const final = stringify(value);
    if (final) {
        return final;
    }

    return "";
}
