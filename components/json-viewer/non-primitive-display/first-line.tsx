import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash } from "lucide-react";
import { NonPrimitive } from "../types";
import getNumberOfItems from "./get-number-of-items";

export default function FirstLine({
  keyString,
  value,
  expanded,
  onToggleExpand,
  onAdd,
  onDelete,
  onEdit,
  isAdding,
  trailingComma = true,
}: {
  keyString?: string;
  value: NonPrimitive;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onAdd?: () => void;
  isAdding?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  trailingComma?: boolean;
}) {
  let symbol = "";

  if (Array.isArray(value)) {
    if (value.length === 0 && !isAdding) {
      symbol = "[]";
    } else {
      symbol = "[";
    }
  } else if (Object.entries(value).length === 0 && !isAdding) {
    symbol = "{}";
  } else {
    symbol = "{";
  }

  const numberOfItems = getNumberOfItems(value);
  return (
    <div className="flex flex-row items-center relative group">
      {numberOfItems > 0 && (
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 absolute -left-8"
          onClick={onToggleExpand}
        >
          {expanded ? <ChevronDown /> : <ChevronRight />}
        </Button>
      )}
      <pre
        className="font-mono font-bold cursor-pointer"
        onDoubleClick={onEdit}
      >
        {keyString ? `${keyString}: ` : ""}
        {symbol}
        {trailingComma && numberOfItems === 0 ? "," : ""}
      </pre>
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6 ml-2 group-hover:visible invisible"
        onClick={onAdd}
      >
        <Plus />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6 ml-2 group-hover:visible invisible"
        onClick={onEdit}
      >
        <Pencil />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6 ml-2 group-hover:visible invisible"
        onClick={onDelete}
      >
        <Trash />
      </Button>
    </div>
  );
}
