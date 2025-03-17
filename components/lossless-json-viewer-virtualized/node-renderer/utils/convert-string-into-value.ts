import { LosslessNumber, parse } from "lossless-json";
import { JSONValue } from "../../types";

export default function convertStringIntoValue(string: string): JSONValue {
    if (string === "null") {
        return null;
    }

    if (string === "true" || string === "false") {
        return string === "true";
    }

    if (!Number.isNaN(+string)) {
        return new LosslessNumber(string);
    }

    if (string.startsWith('"') && string.endsWith('"')) {
        try {
            return parse(string) as JSONValue;
        } catch {
            return string.slice(1, -1);
        }
    }

    try {
        return parse(string) as JSONValue;
    } catch {
        return string;
    }
}
