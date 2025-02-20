import BooleanDisplay from "./boolean-display";
import NullDisplay from "./null-display";
import NumberDisplay from "./number-display";
import StringDisplay from "./string-display";
import { Primitive } from "../types";
import { memo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import parseStringIntoValue from "../non-primitive-display/parse-string-into-value";
import parseValueIntoString from "../non-primitive-display/parse-value-into-string";

export default memo(function PrimitiveDisplay({
  keyString = "",
  value,
  trailingComma = true,
  onChange,
  onDelete,
}: {
  keyString?: string;
  value: Primitive;
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
  const [isEditing, setIsEditing] = useState(false);

  const [editedKey, setEditedKey] = useState(keyString);
  const [editedValue, setEditedValue] = useState(parseValueIntoString(value));

  function handleStartEditing() {
    setEditedKey(keyString);
    setEditedValue(parseValueIntoString(value));
    setIsEditing(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsEditing(false);

    const updatedValue = parseStringIntoValue(editedValue);
    onChange?.({
      updatedKey: editedKey,
      updatedValue,
    });

    setEditedKey("");
    setEditedValue("");
  }

  if (isEditing) {
    return (
      <form
        className="flex flex-row items-center max-w-lg gap-2"
        onSubmit={handleSubmit}
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

  return (
    <div className="flex flex-row group">
      {keyString && (
        <pre
          className="font-bold font-mono cursor-pointer"
          onDoubleClick={handleStartEditing}
        >
          {keyString}:
        </pre>
      )}
      <div
        className="flex flex-row ml-2 cursor-pointer"
        onDoubleClick={handleStartEditing}
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
});
