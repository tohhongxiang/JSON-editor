import { JSONArray, JSONObject } from "../types";

export default function getClosingSymbol(data: JSONArray | JSONObject) {
    if (Array.isArray(data)) {
        return "]";
    }

    return "}";
}
