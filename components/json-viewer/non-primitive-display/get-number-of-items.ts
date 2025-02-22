import { NonPrimitive } from "../types";

export default function getNumberOfItems(value: NonPrimitive) {
  if (Array.isArray(value)) {
    return value.length;
  }

  return Object.entries(value).length;
}
