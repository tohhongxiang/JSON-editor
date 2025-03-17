export default function isValidStringifiedObject(
    data: unknown,
): data is string {
    if (typeof data !== "string") {
        return false;
    }

    const isPossiblyStringifiedArray =
        data.startsWith("[") && data.endsWith("]");
    const isPossiblyStringifiedObject =
        data.startsWith("{") && data.endsWith("}");

    if (!isPossiblyStringifiedArray && !isPossiblyStringifiedObject) {
        return false;
    }

    try {
        JSON.parse(data);
        return true;
    } catch {
        return false;
    }
}
