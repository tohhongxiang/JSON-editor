import { Button } from "@/components/ui/button";
import {
    ClosingSymbol,
    FlattenedJSONOpeningLine,
    JSONValue,
    OpeningSymbol,
} from "../../types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import ValueEditor from "../value-editor";
import { stringify } from "lossless-json";
import ActionsContainer from "../actions-container";

interface OpeningLineDisplayProps {
    node: FlattenedJSONOpeningLine;
    unflattenedValue: JSONValue;
    collapsed?: boolean;
    onExpand?: () => void;
    onCollapse?: () => void;
    onUpdate?: (params: {
        updatedKey: string;
        updatedValue: JSONValue;
    }) => void;
    onAdd?: (params: { updatedKey: string; updatedValue: JSONValue }) => void;
    onDelete?: () => void;
}

export default function OpeningLineDisplay({
    node,
    unflattenedValue,
    collapsed = false,
    onExpand,
    onCollapse,
    onUpdate,
    onAdd,
    onDelete,
}: OpeningLineDisplayProps) {
    function handleToggleCollapse() {
        if (collapsed) {
            onExpand?.();
        } else {
            onCollapse?.();
        }
    }

    const [isEditing, setIsEditing] = useState(false);
    function handleStartEditing() {
        onCollapse?.();
        setIsEditing(true);
    }
    function handleEditSubmit(params: {
        updatedKey: string;
        updatedValue: JSONValue;
    }) {
        onUpdate?.(params);
        setIsEditing(false);
        onExpand?.();
    }

    const [isAdding, setIsAdding] = useState(false);
    function handleStartAdding() {
        onExpand?.();
        setIsAdding(true);
    }

    function handleAddSubmit(params: {
        updatedKey: string;
        updatedValue: JSONValue;
    }) {
        onAdd?.(params);
        setIsAdding(false);
        onExpand?.();
    }

    function handleCancel() {
        setIsEditing(false);
        setIsAdding(false);
        onExpand?.();
    }

    if (isEditing) {
        return (
            <ValueEditor
                nodeKey={node.key}
                nodeValue={stringify(unflattenedValue)}
                onCancel={handleCancel}
                onSubmit={handleEditSubmit}
            />
        );
    }

    return (
        <div>
            <div className="group relative flex flex-row gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute -left-8 h-6 w-6"
                    onClick={handleToggleCollapse}
                >
                    {collapsed ? <ChevronRight /> : <ChevronDown />}
                </Button>
                <button onDoubleClick={handleStartEditing}>
                    <pre className="font-bold">
                        {node.key ? `${node.key}: ` : ""}
                        {node.openingSymbol}
                        {collapsed && (
                            <>
                                {" "}
                                <span className="text-muted-foreground">
                                    {node.children.length - 1}{" "}
                                    {node.children.length - 1 === 1
                                        ? "item"
                                        : "items"}
                                </span>{" "}
                                {getClosingSymbol(node.openingSymbol)}
                            </>
                        )}
                    </pre>
                </button>
                <ActionsContainer
                    onEdit={handleStartEditing}
                    onAdd={handleStartAdding}
                    onDelete={onDelete}
                    className="invisible group-hover:visible"
                />
            </div>
            {isAdding && (
                <ValueEditor
                    nodeKey={Array.isArray(unflattenedValue) ? "0" : ""}
                    isNodeKeyEditable={!Array.isArray(unflattenedValue)}
                    nodeValue={""}
                    onSubmit={handleAddSubmit}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}

function getClosingSymbol(openingSymbol: OpeningSymbol): ClosingSymbol {
    if (openingSymbol === "{") {
        return "}";
    }

    return "]";
}
