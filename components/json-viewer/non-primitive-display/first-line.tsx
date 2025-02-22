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
  const openingSymbol = Array.isArray(value) ? "[" : "{";
  const closingSymbol = Array.isArray(value) ? "]" : "}";

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
      <button onClick={onToggleExpand}>
        {expanded ? (
          <pre className="font-mono font-bold cursor-pointer">
            {keyString ? `${keyString}: ` : ""}
            {openingSymbol}
            {numberOfItems === 0 && !isAdding && closingSymbol}
            {trailingComma && !isAdding && numberOfItems === 0 ? "," : ""}
          </pre>
        ) : (
          <pre className="font-mono font-bold">
            {keyString ? `${keyString}: ` : ""}
            {openingSymbol}
            {numberOfItems > 0 && (
              <span className="text-muted-foreground italic mx-2">
                {numberOfItems} {numberOfItems === 1 ? "item" : "items"}
              </span>
            )}
            {closingSymbol}
            {trailingComma && ","}
          </pre>
        )}
      </button>
      <div className="flex flex-row group-focus-within:visible group-hover:visible invisible gap-2 ml-2">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={onAdd}
        >
          <Plus />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={onEdit}
        >
          <Pencil />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={onDelete}
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
}
