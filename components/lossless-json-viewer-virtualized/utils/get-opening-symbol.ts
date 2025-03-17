import { JSONArray, JSONObject } from "../types";

export default function getOpeningSymbol(data: JSONArray | JSONObject) {
    if (Array.isArray(data)) {
        return "[";
    }

    return "{";
}
