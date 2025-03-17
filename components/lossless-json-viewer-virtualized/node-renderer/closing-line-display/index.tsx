import { useState } from "react";
import {
    FlattenedJSONClosingLine,
    FlattenedJSONOpeningLine,
    JSONValue,
} from "../../types";
import ActionsContainer from "../actions-container";
import ValueEditor from "../value-editor";

export default function ClosingLineDisplay({
    node,
    grandparent,
    onAdd,
    onCollapse,
}: {
    node: FlattenedJSONClosingLine;
    grandparent?: FlattenedJSONOpeningLine;
    onCollapse?: () => void;
    onAdd?: (params: { updatedKey: string; updatedValue: JSONValue }) => void;
}) {
    const [isAdding, setIsAdding] = useState(false);
    function handleAddSubmit(params: {
        updatedKey: string;
        updatedValue: JSONValue;
    }) {
        setIsAdding(false);
        onAdd?.(params);
    }

    if (isAdding) {
        console.log(node, grandparent);
    }
    return (
        <div>
            <div className="group flex flex-row gap-2">
                <button onClick={onCollapse}>
                    <pre className="font-bold">{node.closingSymbol}</pre>
                </button>
                <ActionsContainer
                    onAdd={grandparent ? () => setIsAdding(true) : undefined}
                    className="invisible group-hover:visible"
                />
            </div>
            {isAdding && (
                <ValueEditor
                    nodeKey={
                        grandparent?.openingSymbol === "["
                            ? (
                                  grandparent.children.indexOf(node.parent) + 1
                              ).toString()
                            : ""
                    }
                    isNodeKeyEditable={grandparent?.openingSymbol === "{"}
                    nodeValue={""}
                    onCancel={() => setIsAdding(false)}
                    onSubmit={handleAddSubmit}
                />
            )}
        </div>
    );
}
