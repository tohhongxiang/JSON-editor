import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import parseStringIntoValue from "./utils/parse-string-into-value";
import { JSONValue } from "./types";

export default function KeyStringForm({
    keyString,
    value,
    onSubmit,
    onCancel,
    editableKey = true,
}: {
    keyString: string;
    value: string;
    onSubmit?: ({
        updatedKey,
        updatedValue,
    }: {
        updatedKey: string;
        updatedValue: JSONValue;
    }) => void;
    onCancel?: () => void;
    editableKey?: boolean;
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

    return (
        <form
            className="flex h-full max-w-lg flex-row items-center gap-2"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-row items-center gap-1">
                <Input
                    autoFocus={editableKey}
                    disabled={!editableKey}
                    className="invalid:border-destructive focus:invalid:ring-destructive"
                    value={editedKey}
                    onChange={(e) => setEditedKey(e.target.value)}
                    required
                    placeholder="key"
                />
                <pre className="font-mono font-bold">:</pre>
            </div>
            <Input
                autoFocus={!editableKey}
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                placeholder="value"
            />
            <Button type="submit" size="sm">
                Save
            </Button>
            <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onCancel}
            >
                Cancel
            </Button>
        </form>
    );
}
