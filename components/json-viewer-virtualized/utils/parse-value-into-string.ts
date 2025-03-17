export default function parseValueIntoString(value: unknown) {
    if (value === null) {
        return "null";
    }

    if (typeof value === "boolean" || typeof value === "number") {
        return value.toString();
    }

    if (typeof value === "string") {
        return '"' + (value?.toString() ?? "") + '"';
    }

    return JSON.stringify(value);
}
