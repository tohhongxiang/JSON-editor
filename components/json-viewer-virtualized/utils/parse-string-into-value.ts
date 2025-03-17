import { JSONValue } from "../types";

export default function parseStringIntoValue(string: string): JSONValue {
    if (string.length === 0) {
        return "";
    }

    if (string.startsWith('"') && string.endsWith('"')) {
        try {
            return JSON.parse(string);
        } catch {
            return string.slice(1, -1);
        }
    }

    if (
        (string.startsWith("[") && string.endsWith("]")) ||
        (string.startsWith("{") && string.endsWith("}"))
    ) {
        try {
            return JSON.parse(string);
        } catch {
            return string;
        }
    }

    if (string === "true" || string === "false") {
        return string === "true" ? true : false;
    }

    if (string === "null") {
        return null;
    }

    if (!Number.isNaN(+string)) {
        return +string;
    }

    return string;
}
