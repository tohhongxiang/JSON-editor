export default function tryConvertToObject(value: string) {
  if (!value.startsWith("{") && !value.startsWith("[")) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
