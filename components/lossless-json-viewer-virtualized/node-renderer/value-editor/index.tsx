import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { JSONValue } from "../../types";
import convertStringIntoValue from "../utils/convert-string-into-value";

interface ValueEditorProps {
    nodeKey?: string;
    isNodeKeyEditable?: boolean;
    nodeValue?: string;
    onCancel?: () => void;
    onSubmit?: ({
        updatedKey,
        updatedValue,
    }: {
        updatedKey: string;
        updatedValue: JSONValue;
    }) => void;
}

export default function ValueEditor({
    nodeKey = "",
    isNodeKeyEditable = true,
    nodeValue = "",
    onCancel,
    onSubmit,
}: ValueEditorProps) {
    const [editedNodeKey, setEditedNodeKey] = useState(nodeKey);
    const [editedNodeValue, setEditedNodeValue] = useState(nodeValue);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const processedUpdatedValue = convertStringIntoValue(editedNodeValue);
        onSubmit?.({
            updatedKey: editedNodeKey,
            updatedValue: processedUpdatedValue,
        });
    }

    return (
        <form
            className="flex max-w-lg flex-row items-center gap-2"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-row items-center gap-1">
                <Input
                    value={editedNodeKey}
                    onChange={(e) => setEditedNodeKey(e.target.value)}
                    placeholder="key"
                    disabled={!isNodeKeyEditable}
                    className="max-w-[100px]"
                />
                <pre className="font-bold">:</pre>
                <Input
                    value={editedNodeValue}
                    onChange={(e) => setEditedNodeValue(e.target.value)}
                    placeholder="value"
                />
            </div>
            <Button>Submit</Button>
            <Button variant="secondary" type="button" onClick={onCancel}>
                Cancel
            </Button>
        </form>
    );
}
