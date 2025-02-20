export default function parseStringIntoValue(string: string) {
  if (string.startsWith('"') && string.endsWith('"')) {
    try {
      return JSON.parse(string);
    } catch (e) {
      console.log(e);
      return string.slice(1, -1);
    }
  } else if (
    (string.startsWith("[") && string.endsWith("]")) ||
    (string.startsWith("{") && string.endsWith("}"))
  ) {
    try {
      return JSON.parse(string);
    } catch {
      return string;
    }
  } else if (string === "true" || string === "false") {
    return string === "true" ? true : false;
  } else if (string === "null") {
    return null;
  } else if (!Number.isNaN(parseFloat(string))) {
    return parseFloat(string);
  } else {
    return string;
  }
}
