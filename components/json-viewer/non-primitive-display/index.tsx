import { NonPrimitive } from "../types";
import { useState } from "react";
import KeyStringForm from "../key-string-form";
import FirstLine from "./first-line";
import LastLine from "./last-line";
import getNumberOfItems from "./get-number-of-items";
import MiddleLine from "./middle-line";
import { cn } from "@/lib/utils";

interface NonPrimitiveDisplayProps
  extends Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    "onChange"
  > {
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
}

export default function NonPrimitiveDisplay({
  keyString = "",
  value,
  trailingComma = true,
  onChange,
  onDelete,
  ...props
}: NonPrimitiveDisplayProps) {
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
  const [focusOn, setFocusOn] = useState<"key" | "value">("value");

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
        autoFocusOn={focusOn}
        value={JSON.stringify(value)}
        onCancel={() => setIsEditing(false)}
        onSubmit={handleConfirmEdit}
      />
    );
  }

  return (
    <div
      {...props}
      className={cn(
        "displayer rounded-md hover:bg-gray-500/10 has-[.displayer:hover]:bg-inherit",
        props.className
      )}
    >
      <FirstLine
        keyString={keyString}
        value={value}
        expanded={expanded}
        isAdding={isAdding}
        onToggleExpand={() => setExpanded((c) => !c)}
        trailingComma={trailingComma}
        onDelete={onDelete}
        onAdd={() => {
          setExpanded(true);
          setIsAdding(true);
        }}
        onEdit={(autoFocusOn) => {
          setIsEditing(true);
          setFocusOn(autoFocusOn);
        }}
      />
      <div className="pl-4 border-l-2">
        {isAdding && (
          <KeyStringForm
            showKey={!Array.isArray(value)}
            keyString=""
            value=""
            autoFocusOn="key"
            onCancel={() => setIsAdding(false)}
            onSubmit={handleConfirmAdd}
          />
        )}
        {expanded && (
          <MiddleLine
            value={value}
            onChange={handleChange}
            onDelete={handleDelete}
          />
        )}
      </div>
      {expanded && (getNumberOfItems(value) > 0 || isAdding) && (
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
