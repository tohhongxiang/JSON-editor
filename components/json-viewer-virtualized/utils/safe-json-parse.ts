export default function safeJSONParse(text: string) {
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}
