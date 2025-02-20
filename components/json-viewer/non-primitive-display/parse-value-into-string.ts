export default function parseValueIntoString(value: unknown) {
  return value === null
    ? "null"
    : typeof value === "boolean" || typeof value === "number"
    ? value.toString()
    : '"' + (value?.toString() ?? "") + '"';
}
