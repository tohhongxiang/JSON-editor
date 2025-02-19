import { ChevronDown, ChevronRight, Plus, Trash } from "lucide-react";
import PrimitiveDisplay from "../primitive-display";
import { NonPrimitive } from "../types";
import isPrimitive from "./is-primitive";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CollapsedItem from "./collapsed-item";

export default function NonPrimitiveDisplay({
  keyString,
  value,
  trailingComma = true,
  onChange,
  onDelete,
}: {
  keyString?: string;
  value: NonPrimitive;
  trailingComma?: boolean;
  onChange?: (updatedValue: unknown) => void;
  onDelete?: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  function handleChange(updatedValue: unknown, location: string | number) {
    const finalUpdatedValue = Array.isArray(value) ? [...value] : { ...value };

    // @ts-expect-error Magic
    finalUpdatedValue[location] = updatedValue;

    onChange?.(finalUpdatedValue);
  }

  function handleDelete(location: string | number) {
    const finalUpdatedValue = Array.isArray(value) ? [...value] : { ...value };
    if (typeof location === "number") {
      // @ts-expect-error Magic
      finalUpdatedValue.splice(location, 1);
    } else {
      // @ts-expect-error Magic
      delete finalUpdatedValue[location];
    }

    onChange?.(finalUpdatedValue);
  }

  if (!expanded) {
    return (
      <CollapsedItem
        keyString={keyString}
        value={value}
        trailingComma={trailingComma}
        expanded={expanded}
        onToggleExpand={() => setExpanded((c) => !c)}
      />
    );
  }

  return (
    <div className="rounded-md">
      <FirstLine
        keyString={keyString}
        value={value}
        expanded={expanded}
        onToggleExpand={() => setExpanded((c) => !c)}
        trailingComma={trailingComma}
        onDelete={onDelete}
      />
      {expanded && (
        <>
          <div className="pl-4 border-l-2">
            <MiddleLine
              value={value}
              onChange={handleChange}
              onDelete={handleDelete}
            />
          </div>
          <LastLine value={value} trailingComma={trailingComma} />
        </>
      )}
    </div>
  );
}

function getNumberOfItems(value: NonPrimitive) {
  if (Array.isArray(value)) {
    return value.length;
  }

  return Object.entries(value).length;
}

function FirstLine({
  keyString,
  value,
  expanded,
  onToggleExpand,
  onAdd,
  onDelete,
  trailingComma = true,
}: {
  keyString?: string;
  value: NonPrimitive;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onAdd?: () => void;
  onDelete?: () => void;
  trailingComma?: boolean;
}) {
  let symbol = "";

  if (Array.isArray(value)) {
    if (value.length === 0) {
      symbol = "[]";
    } else {
      symbol = "[";
    }
  } else if (Object.entries(value).length === 0) {
    symbol = "{}";
  } else {
    symbol = "{";
  }

  const numberOfItems = getNumberOfItems(value);
  return (
    <div className="flex flex-row items-center relative">
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
      <pre className="font-mono font-bold">
        {keyString ? `${keyString}: ` : ""}
        {symbol}
        {trailingComma && numberOfItems === 0 ? "," : ""}
      </pre>
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6 ml-2"
        onClick={onAdd}
      >
        <Plus />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6 ml-2"
        onClick={onDelete}
      >
        <Trash />
      </Button>
    </div>
  );
}

function LastLine({
  value,
  trailingComma = true,
}: {
  value: NonPrimitive;
  trailingComma?: boolean;
}) {
  let symbol = "";
  if (Array.isArray(value) && value.length > 0) {
    symbol = "]";
  } else if (Object.entries(value).length > 0) {
    symbol = "}";
  }

  return (
    <pre className="font-mono font-bold">
      {symbol}
      {trailingComma && getNumberOfItems(value) > 0 ? "," : ""}
    </pre>
  );
}

function MiddleLine({
  value,
  onChange,
  onDelete,
}: {
  value: NonPrimitive;
  onChange?: (updatedValue: unknown, location: string | number) => void;
  onDelete?: (location: string | number) => void;
}) {
  if (
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && Object.entries(value).length === 0)
  ) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((v, index) =>
      isPrimitive(v) ? (
        <PrimitiveDisplay
          value={v}
          trailingComma={index < value.length - 1}
          key={index}
          onChange={(updated) => onChange?.(updated, index)}
          onDelete={() => onDelete?.(index)}
        />
      ) : (
        <NonPrimitiveDisplay
          value={v as NonPrimitive}
          trailingComma={index < value.length - 1}
          key={index}
          onChange={(updated) => onChange?.(updated, index)}
          onDelete={() => onDelete?.(index)}
        />
      )
    );
  }

  const keyValuePairs = Object.entries(value);
  return keyValuePairs.map(([k, v], index) =>
    isPrimitive(v) ? (
      <PrimitiveDisplay
        keyString={k}
        value={v}
        trailingComma={index < keyValuePairs.length - 1}
        key={k}
        onChange={(updated) => onChange?.(updated, k)}
        onDelete={() => onDelete?.(k)}
      />
    ) : (
      <NonPrimitiveDisplay
        keyString={k}
        value={v as NonPrimitive}
        trailingComma={index < keyValuePairs.length - 1}
        key={k}
        onChange={(updated) => onChange?.(updated, k)}
        onDelete={() => onDelete?.(k)}
      />
    )
  );
}
