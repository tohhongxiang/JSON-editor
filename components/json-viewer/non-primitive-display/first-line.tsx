import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash } from "lucide-react";
import { NonPrimitive } from "../types";
import getNumberOfItems from "./get-number-of-items";
import { cn } from "@/lib/utils";

interface FirstLineProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  keyString?: string;
  value: NonPrimitive;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onAdd?: () => void;
  isAdding?: boolean;
  onEdit?: (autoFocusOn: "key" | "value") => void;
  onDelete?: () => void;
  trailingComma?: boolean;
}

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
  ...props
}: FirstLineProps) {
  const openingSymbol = Array.isArray(value) ? "[" : "{";
  const closingSymbol = Array.isArray(value) ? "]" : "}";

  const numberOfItems = getNumberOfItems(value);
  return (
    <div
      className={cn(
        "flex flex-row items-center relative group",
        props.className
      )}
      {...props}
    >
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
      <button onClick={onToggleExpand} tabIndex={-1}>
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
      <div className="flex flex-row group-hover:opacity-100 opacity-0 gap-2 ml-2 group-has-[:focus-visible]:opacity-100">
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
          onClick={() => onEdit?.("value")}
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
