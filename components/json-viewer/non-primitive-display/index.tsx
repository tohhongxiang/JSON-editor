import { ChevronDown, ChevronRight, Plus, Trash } from "lucide-react";
import PrimitiveDisplay from "../primitive-display";
import { NonPrimitive } from "../types";
import isPrimitive from "./is-primitive";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CollapsedItem from "./collapsed-item";
import tryConvertToObject from "./try-convert-to-object";
import { Input } from "@/components/ui/input";
import parseStringIntoValue from "./parse-string-into-value";

export default function NonPrimitiveDisplay({
  keyString = "",
  value,
  trailingComma = true,
  onChange,
  onDelete,
}: {
  keyString?: string;
  value: NonPrimitive;
  trailingComma?: boolean;
  onChange?: ({
    updatedKey,
    updatedValue,
  }: {
    updatedKey: string;
    updatedValue: unknown;
  }) => void;
  onDelete?: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  function handleChange(
    { updatedKey, updatedValue }: { updatedKey: string; updatedValue: unknown },
    location: string | number
  ) {
    console.log({ updatedKey, updatedValue, location });

    if (Array.isArray(value) && typeof location === "number") {
      const finalUpdatedValue = [...value];
      finalUpdatedValue[location] = updatedValue;

      console.log({ updatedKey: keyString, updatedValue: finalUpdatedValue });

      onChange?.({ updatedKey: keyString, updatedValue: finalUpdatedValue });
      return;
    }

    const finalUpdatedValue = Object.fromEntries(
      Object.entries(value).map(([key, value]) => {
        if (key !== location) {
          return [key, value];
        }

        return [updatedKey, updatedValue];
      })
    );

    onChange?.({ updatedKey: keyString, updatedValue: finalUpdatedValue });
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

    onChange?.({ updatedKey: keyString, updatedValue: finalUpdatedValue });
  }

  const [isAdding, setIsAdding] = useState(false);
  const [addedKey, setAddedKey] = useState("");
  const [addedValue, setAddedValue] = useState("");
  function handleStartAdd() {
    setIsAdding(true);
  }

  function handleConfirmAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newValue = parseStringIntoValue(addedValue);
    if (Array.isArray(value)) {
      onChange?.({ updatedKey: keyString, updatedValue: [newValue, ...value] });
    } else {
      onChange?.({
        updatedKey: keyString,
        updatedValue: { [addedKey]: newValue, ...value },
      });
    }

    setAddedKey("");
    setAddedValue("");
    setIsAdding(false);
  }

  const [isEditing, setIsEditing] = useState(false);
  const [editedKey, setEditedKey] = useState("");
  const [editedValue, setEditedValue] = useState("");

  function handleStartEdit() {
    setEditedKey(keyString);
    setEditedValue(JSON.stringify(value));
    setIsEditing(true);
  }

  function handleConfirmEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onChange?.({
      updatedKey: editedKey,
      updatedValue: parseStringIntoValue(editedValue),
    });
    setIsEditing(false);
    setEditedKey("");
    setEditedValue("");
  }

  if (isEditing) {
    return (
      <form
        className="flex flex-row items-center max-w-lg gap-2"
        onSubmit={handleConfirmEdit}
      >
        {keyString && (
          <Input
            value={editedKey}
            onChange={(e) => setEditedKey(e.target.value)}
          />
        )}
        <Input
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
        />
        <Button type="submit" size="sm">
          Save
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
      </form>
    );
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
        isAdding={isAdding}
        onToggleExpand={() => setExpanded((c) => !c)}
        trailingComma={trailingComma}
        onDelete={onDelete}
        onAdd={handleStartAdd}
        onEdit={handleStartEdit}
      />
      {expanded && (
        <>
          <div className="pl-4 border-l-2">
            {isAdding && (
              <form
                className="flex flex-row gap-1 items-center"
                onSubmit={handleConfirmAdd}
              >
                {!Array.isArray(value) && (
                  <>
                    <Input
                      value={addedKey}
                      onChange={(e) => setAddedKey(e.target.value)}
                      className="max-w-[100px]"
                      placeholder="key"
                    />
                    <pre className="font-mono font-bold">:</pre>
                  </>
                )}
                <Input
                  value={addedValue}
                  onChange={(e) => setAddedValue(e.target.value)}
                  className="max-w-[300px]"
                  placeholder="value"
                />
                <Button size="sm" type="submit">
                  Submit
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsAdding(false)}
                  type="button"
                >
                  Cancel
                </Button>
              </form>
            )}
            <MiddleLine
              value={value}
              onChange={handleChange}
              onDelete={handleDelete}
            />
          </div>
          <LastLine
            value={value}
            trailingComma={trailingComma}
            isAdding={isAdding}
          />
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
        onClick={onDelete}
      >
        <Trash />
      </Button>
    </div>
  );
}

function LastLine({
  value,
  isAdding,
  trailingComma = true,
}: {
  value: NonPrimitive;
  isAdding?: boolean;
  trailingComma?: boolean;
}) {
  let symbol = "";
  if (Array.isArray(value) && (value.length > 0 || isAdding)) {
    symbol = "]";
  } else if (Object.entries(value).length > 0 || isAdding) {
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
  onChange?: (
    { updatedKey, updatedValue }: { updatedKey: string; updatedValue: unknown },
    location: string | number
  ) => void;
  onDelete?: (location: string | number) => void;
}) {
  if (
    // empty object and array
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && Object.entries(value).length === 0)
  ) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((v, index) => {
      if (isPrimitive(v)) {
        if (typeof v === "string") {
          const finalV = tryConvertToObject(v);
          if (typeof finalV === "string") {
            return (
              <PrimitiveDisplay
                value={finalV}
                trailingComma={index < value.length - 1}
                key={index}
                onChange={(updated) => onChange?.(updated, index)}
                onDelete={() => onDelete?.(index)}
              />
            );
          }

          return (
            <NonPrimitiveDisplay
              value={finalV}
              trailingComma={index < value.length - 1}
              key={index}
              onChange={({ updatedKey, updatedValue }) =>
                onChange?.(
                  {
                    updatedKey: updatedKey,
                    updatedValue: JSON.stringify(updatedValue),
                  },
                  index
                )
              }
              onDelete={() => onDelete?.(index)}
            />
          );
        }

        return (
          <PrimitiveDisplay
            value={v}
            trailingComma={index < value.length - 1}
            key={index}
            onChange={(updated) => onChange?.(updated, index)}
            onDelete={() => onDelete?.(index)}
          />
        );
      }

      return (
        <NonPrimitiveDisplay
          value={v as NonPrimitive}
          trailingComma={index < value.length - 1}
          key={index}
          onChange={(updatedValue) => onChange?.(updatedValue, index)}
          onDelete={() => onDelete?.(index)}
        />
      );
    });
  }

  const keyValuePairs = Object.entries(value);
  return keyValuePairs.map(([k, v], index) => {
    if (isPrimitive(v)) {
      if (typeof v !== "string") {
        // if not string, won't be stringified object
        return (
          <PrimitiveDisplay
            keyString={k}
            value={v}
            trailingComma={index < keyValuePairs.length - 1}
            key={k}
            onChange={(updated) => onChange?.(updated, k)}
            onDelete={() => onDelete?.(k)}
          />
        );
      }

      const finalV = tryConvertToObject(v); // check if stringified object, and display accordingly
      if (typeof finalV === "string") {
        return (
          <PrimitiveDisplay
            keyString={k}
            value={finalV}
            trailingComma={index < keyValuePairs.length - 1}
            key={k}
            onChange={(updated) => onChange?.(updated, k)}
            onDelete={() => onDelete?.(k)}
          />
        );
      }

      return (
        <NonPrimitiveDisplay
          keyString={k}
          value={finalV}
          trailingComma={index < keyValuePairs.length - 1}
          key={k}
          onChange={({ updatedKey, updatedValue }) =>
            onChange?.(
              {
                updatedKey: updatedKey,
                updatedValue: JSON.stringify(updatedValue),
              },
              k
            )
          }
          onDelete={() => onDelete?.(k)}
        />
      );
    }

    return (
      <NonPrimitiveDisplay
        keyString={k}
        value={v as NonPrimitive}
        trailingComma={index < keyValuePairs.length - 1}
        key={k}
        onChange={(updatedValue) => onChange?.(updatedValue, k)}
        onDelete={() => onDelete?.(k)}
      />
    );
  });
}
