import { buttonVariants } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NonPrimitive } from "../types";
import { cn } from "@/lib/utils";

export default function CollapsedItem({
  keyString,
  value,
  expanded,
  onToggleExpand,
  trailingComma = true,
}: {
  keyString?: string;
  value: NonPrimitive;
  expanded?: boolean;
  onToggleExpand?: () => void;
  trailingComma?: boolean;
}) {
  const openingSymbol = Array.isArray(value) ? "[" : "{";
  const closingSymbol = Array.isArray(value) ? "]" : "}";
  const numberOfItems = getNumberOfItems(value);

  return (
    <button
      className="flex flex-row items-center relative"
      onClick={onToggleExpand}
      tabIndex={-1}
    >
      {numberOfItems > 0 && (
        <div
          tabIndex={0}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "h-6 w-6 absolute -left-8"
          )}
        >
          {expanded ? <ChevronDown /> : <ChevronRight />}
        </div>
      )}
      <pre className="font-mono font-bold">
        {keyString ? `${keyString}: ` : ""}
        {openingSymbol}{" "}
        <span className="text-muted-foreground italic">
          {numberOfItems} {numberOfItems === 1 ? "item" : "items"}
        </span>{" "}
        {closingSymbol}
        {trailingComma && ","}
      </pre>
    </button>
  );
}

function getNumberOfItems(value: NonPrimitive) {
  if (Array.isArray(value)) {
    return value.length;
  }

  return Object.entries(value).length;
}
