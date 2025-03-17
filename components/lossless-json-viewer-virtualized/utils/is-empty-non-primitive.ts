import { JSONArray, JSONObject } from "../types";

export default function isEmptyNonPrimitive(data: JSONArray | JSONObject) {
    return (
        (Array.isArray(data) && data.length === 0) ||
        Object.entries(data).length === 0
    );
}
