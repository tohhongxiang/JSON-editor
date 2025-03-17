import { parse } from "lossless-json";

export default function safeJSONParse(text: string) {
    try {
        return parse(text);
    } catch {
        return text;
    }
}
