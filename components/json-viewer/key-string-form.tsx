import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import parseStringIntoValue from "./utils/parse-string-into-value";

export default function KeyStringForm({
  keyString,
  value,
  onSubmit,
  onCancel,
  showKey,
  autoFocusOn = "value",
}: {
  keyString: string;
  value: string;
  showKey?: boolean;
  onSubmit?: ({
    updatedKey,
    updatedValue,
  }: {
    updatedKey: string;
    updatedValue: unknown;
  }) => void;
  onCancel?: () => void;
  autoFocusOn?: "key" | "value";
}) {
  const [editedKey, setEditedKey] = useState("");
  const [editedValue, setEditedValue] = useState(value);

  useEffect(() => {
    setEditedKey(keyString);
    setEditedValue(value);
  }, [keyString, value]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit?.({
      updatedKey: editedKey,
      updatedValue: parseStringIntoValue(editedValue),
    });

    setEditedKey(keyString);
    setEditedValue(value);
  }

  const showKeyInput = keyString || showKey;
  return (
    <form
      className="flex flex-row items-center max-w-lg gap-2 displayer"
      onSubmit={handleSubmit}
    >
      {showKeyInput && (
        <div className="flex flex-row items-center gap-1">
          <Input
            autoFocus={autoFocusOn === "key"}
            className="invalid:border-destructive focus:invalid:ring-destructive"
            value={editedKey}
            onChange={(e) => setEditedKey(e.target.value)}
            required
            placeholder="key"
          />
          <pre className="font-mono font-bold">:</pre>
        </div>
      )}
      <Input
        autoFocus={autoFocusOn === "value" || !showKeyInput}
        value={editedValue}
        onChange={(e) => setEditedValue(e.target.value)}
        placeholder="value"
      />
      <Button type="submit" size="sm">
        Save
      </Button>
      <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
}
