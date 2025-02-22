import BooleanDisplay from "./boolean-display";
import NullDisplay from "./null-display";
import NumberDisplay from "./number-display";
import StringDisplay from "./string-display";
import { Primitive } from "../types";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import parsePrimitiveIntoString from "../utils/parse-value-into-string";
import KeyStringForm from "../key-string-form";

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

  function handleSubmit({
    updatedKey,
    updatedValue,
  }: {
    updatedKey: string;
    updatedValue: unknown;
  }) {
    setIsEditing(false);
    onChange?.({
      updatedKey,
      updatedValue,
    });
  }

  if (isEditing) {
    return (
      <KeyStringForm
        keyString={keyString}
        value={parsePrimitiveIntoString(value)}
        onCancel={() => setIsEditing(false)}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <div className="flex flex-row items-center group">
      <button
        onDoubleClick={() => setIsEditing(true)}
        className="displayer flex flex-row items-center px-1 gap-2 group-focus-within:bg-border hover:bg-gray-500/5 rounded-md has-[.displayer:hover]:bg-inherit"
        tabIndex={-1}
      >
        {keyString && (
          <pre className="font-bold font-mono cursor-pointer">{keyString}:</pre>
        )}
        <div className={"flex flex-row cursor-pointer"}>
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
        </div>
      </button>
      <div className="flex flex-row gap-2 group-has-[:focus-visible]:opacity-100 group-hover:opacity-100 opacity-0 ml-2">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsEditing(true)}
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
});
