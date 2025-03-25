import { isLosslessNumber } from "lossless-json";
import BooleanDisplay from "./boolean-display";
import LosslessNumberDisplay from "./lossless-number-display";
import NullDisplay from "./null-display";
import NumberDisplay from "./number-display";
import StringDisplay from "./string-display";
import {
    FlattenedJSONOpeningLine,
    FlattenedJSONPrimitiveLine,
    JSONValue,
} from "../../types";
import { useState } from "react";
import ValueEditor from "../value-editor";
import convertValueIntoString from "../utils/convert-value-into-string";
import ActionsContainer from "../actions-container";

export default function PrimitiveDisplay({
    node,
    parent,
    onUpdate,
    onAdd,
    onDelete,
}: {
    node: FlattenedJSONPrimitiveLine;
    parent?: FlattenedJSONOpeningLine;
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
                nodeValue={convertValueIntoString(node.value)}
                onCancel={() => setIsEditing(false)}
                onSubmit={handleEditSubmit}
            />
        );
    }

    return (
        <div className="flex flex-col">
            <div className="group flex flex-row">
                <button
                    className="flex flex-row pr-2"
                    onDoubleClick={() => setIsEditing(true)}
                >
                    {node.key ? (
                        <pre className="font-bold">{node.key}: </pre>
                    ) : null}
                    {isLosslessNumber(node.value) ? (
                        <LosslessNumberDisplay value={node.value} />
                    ) : typeof node.value === "boolean" ? (
                        <BooleanDisplay value={node.value} />
                    ) : typeof node.value === "number" ? (
                        <NumberDisplay value={node.value} />
                    ) : typeof node.value === "string" ? (
                        <StringDisplay value={node.value} />
                    ) : (
                        <NullDisplay />
                    )}
                </button>
                <ActionsContainer
                    onEdit={() => setIsEditing(true)}
                    onAdd={node.parent ? () => setIsAdding(true) : undefined}
                    onDelete={onDelete}
                    onCopy={() =>
                        navigator.clipboard.writeText(
                            convertValueIntoString(node.value),
                        )
                    }
                    className="invisible group-hover:visible"
                />
            </div>
            {isAdding && (
                <ValueEditor
                    nodeKey={
                        parent?.openingSymbol === "["
                            ? (parent.children.indexOf(node.id) + 1).toString()
                            : ""
                    }
                    isNodeKeyEditable={parent?.openingSymbol !== "["}
                    nodeValue={""}
                    onSubmit={handleAddSubmit}
                    onCancel={() => setIsAdding(false)}
                />
            )}
        </div>
    );
}
