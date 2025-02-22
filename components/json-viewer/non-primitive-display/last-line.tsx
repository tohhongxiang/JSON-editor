import { NonPrimitive } from "../types";

export default function LastLine({
  value,
  isAdding,
  trailingComma = true,
  onEdit,
}: {
  value: NonPrimitive;
  isAdding?: boolean;
  trailingComma?: boolean;
  onEdit?: () => void;
}) {
  let symbol = "";
  if (Array.isArray(value) && (value.length > 0 || isAdding)) {
    symbol = "]";
  } else if (Object.entries(value).length > 0 || isAdding) {
    symbol = "}";
  }

  return (
    <button onDoubleClick={onEdit} tabIndex={-1}>
      <pre className="font-mono font-bold">
        {symbol}
        {trailingComma && ","}
      </pre>
    </button>
  );
}
