import { NonPrimitive } from "../types";
import { useState } from "react";
import CollapsedItem from "./collapsed-item";
import KeyStringForm from "../key-string-form";
import FirstLine from "./first-line";
import LastLine from "./last-line";
import getNumberOfItems from "./get-number-of-items";
import MiddleLine from "./middle-line";

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
  function handleChange(
    { updatedKey, updatedValue }: { updatedKey: string; updatedValue: unknown },
    location: string | number
  ) {
    if (Array.isArray(value) && typeof location === "number") {
      const finalUpdatedValue = [...value];
      finalUpdatedValue[location] = updatedValue;

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
    if (Array.isArray(finalUpdatedValue)) {
      finalUpdatedValue.splice(location as number, 1);
    } else {
      delete finalUpdatedValue[location];
    }

    onChange?.({ updatedKey: keyString, updatedValue: finalUpdatedValue });
  }

  const [isAdding, setIsAdding] = useState(false);
  function handleConfirmAdd({
    updatedKey,
    updatedValue,
  }: {
    updatedKey: string;
    updatedValue: unknown;
  }) {
    if (Array.isArray(value)) {
      onChange?.({
        updatedKey: keyString,
        updatedValue: [updatedValue, ...value],
      });
    } else {
      onChange?.({
        updatedKey: keyString,
        updatedValue: { [updatedKey]: updatedValue, ...value },
      });
    }

    setIsAdding(false);
  }

  const [isEditing, setIsEditing] = useState(false);
  function handleConfirmEdit({
    updatedKey,
    updatedValue,
  }: {
    updatedKey: string;
    updatedValue: unknown;
  }) {
    onChange?.({
      updatedKey,
      updatedValue,
    });
    setIsEditing(false);
  }

  const [expanded, setExpanded] = useState(true);

  if (isEditing) {
    return (
      <KeyStringForm
        keyString={keyString}
        value={JSON.stringify(value)}
        onCancel={() => setIsEditing(false)}
        onSubmit={handleConfirmEdit}
      />
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
        onAdd={() => setIsAdding(true)}
        onEdit={() => setIsEditing(true)}
      />
      <div className="pl-4 border-l-2">
        {isAdding && (
          <KeyStringForm
            showKey={!Array.isArray(value)}
            keyString=""
            value=""
            onCancel={() => setIsAdding(false)}
            onSubmit={handleConfirmAdd}
          />
        )}
        <MiddleLine
          value={value}
          onChange={handleChange}
          onDelete={handleDelete}
        />
      </div>
      {(getNumberOfItems(value) > 0 || isAdding) && (
        <LastLine
          value={value}
          trailingComma={trailingComma}
          isAdding={isAdding}
          onEdit={() => setIsEditing(true)}
        />
      )}
    </div>
  );
}
