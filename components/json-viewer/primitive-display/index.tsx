import BooleanDisplay from "./boolean-display";
import NullDisplay from "./null-display";
import NumberDisplay from "./number-display";
import StringDisplay from "./string-display";
import { Primitive } from "../types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function PrimitiveDisplay({
  keyString,
  value,
  trailingComma = true,
  onChange,
  onDelete,
}: {
  keyString?: string;
  value: Primitive;
  trailingComma?: boolean;
  onChange?: (updatedValue: unknown) => void;
  onDelete?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(
    value === null
      ? "null"
      : typeof value === "boolean" || typeof value === "number"
      ? value.toString()
      : '"' + value.toString() + '"'
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsEditing(false);

    let updatedValue;
    if (editedValue === "true" || editedValue === "false") {
      updatedValue = editedValue === "true" ? true : false;
    } else if (editedValue === "null") {
      updatedValue = null;
    } else if (editedValue.startsWith('"') && editedValue.endsWith('"')) {
      updatedValue = editedValue.slice(1, -1);
    } else if (!Number.isNaN(parseFloat(editedValue))) {
      updatedValue = parseFloat(editedValue);
    } else {
      updatedValue = editedValue;
    }

    onChange?.(updatedValue);
  }

  if (isEditing) {
    return (
      <form
        className="flex flex-row items-center max-w-lg gap-2"
        onSubmit={handleSubmit}
      >
        {keyString && <pre className="font-bold font-mono">{keyString}:</pre>}
        <Input
          value={editedValue as string}
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

  return (
    <div className="flex flex-row group">
      {keyString && <pre className="font-bold font-mono">{keyString}:</pre>}
      <div
        className="flex flex-row ml-2 cursor-pointer"
        onDoubleClick={() => setIsEditing(true)}
      >
        {typeof value === "boolean" ? (
          <BooleanDisplay value={value} />
        ) : typeof value === "number" ? (
          <NumberDisplay value={value} />
        ) : typeof value === "string" ? (
          <StringDisplay value={value} />
        ) : (
          <NullDisplay />
        )}
        {trailingComma && <pre className="font-bold font-mono">,</pre>}
        <Button
          variant="outline"
          className="h-6 w-6 ml-2 group-hover:visible invisible"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
