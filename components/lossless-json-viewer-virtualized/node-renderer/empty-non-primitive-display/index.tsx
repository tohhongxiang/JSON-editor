import { useState } from "react";
import { FlattenedJSONEmptyNonPrimitiveLine, JSONValue } from "../../types";
import ValueEditor from "../value-editor";
import { stringify } from "lossless-json";
import ActionsContainer from "../actions-container";

export default function EmptyNonPrimitiveDisplay({
    node,
    unflattenedValue,
    onUpdate,
    onAdd,
    onDelete,
}: {
    node: FlattenedJSONEmptyNonPrimitiveLine;
    unflattenedValue: JSONValue;
    onUpdate?: (params: {
        updatedKey: string;
        updatedValue: JSONValue;
    }) => void;
    onAdd?: (params: { updatedKey: string; updatedValue: JSONValue }) => void;
    onDelete?: () => void;
}) {
    const [isEditing, setIsEditing] = useState(false);

    function handleEditSubmit(params: {
        updatedKey: string;
        updatedValue: JSONValue;
    }) {
        setIsEditing(false);
        onUpdate?.(params);
    }

    const [isAdding, setIsAdding] = useState(false);
    function handleAddSubmit(params: {
        updatedKey: string;
        updatedValue: JSONValue;
    }) {
        setIsAdding(false);
        onAdd?.(params);
    }

    if (isEditing) {
        return (
            <ValueEditor
                nodeKey={node.key}
                nodeValue={stringify(unflattenedValue)}
                onCancel={() => setIsEditing(false)}
                onSubmit={handleEditSubmit}
            />
        );
    }

    if (isAdding) {
        return (
            <div>
                <pre className="font-bold">
                    {node.key ? `${node.key}: ` : ""}
                    {node.openingSymbol}
                </pre>
                <ValueEditor
                    nodeKey={Array.isArray(unflattenedValue) ? "0" : ""}
                    isNodeKeyEditable={!Array.isArray(unflattenedValue)}
                    nodeValue={""}
                    onSubmit={handleAddSubmit}
                    onCancel={() => setIsAdding(false)}
                />
                <pre className="font-bold">{node.closingSymbol}</pre>
            </div>
        );
    }

    return (
        <div className="group flex flex-row gap-2">
            <button onDoubleClick={() => setIsEditing(true)}>
                <pre className="font-bold">
                    {node.key ? `${node.key}: ` : ""}
                    {node.openingSymbol} {node.closingSymbol}
                </pre>
            </button>
            <ActionsContainer
                onEdit={() => setIsEditing(true)}
                onAdd={() => setIsAdding(true)}
                onDelete={onDelete}
                className="invisible group-hover:visible"
            />
        </div>
    );
}
