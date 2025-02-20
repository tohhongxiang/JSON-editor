export default function parsePrimitiveIntoString(value: unknown) {
  if (value === null) {
    return "null";
  }

  if (typeof value === "boolean" || typeof value === "number") {
    return value.toString();
  }

  return '"' + (value?.toString() ?? "") + '"';
}
