import {
    FlattenedJSONNode,
    FlattenedJSONOpeningLine,
    JSONValue,
} from "../types";
import isClosingLineNode from "../utils/is-closing-line-node";
import isPrimitiveNode from "../utils/is-primitive-node";
import ClosingLineDisplay from "./closing-line-display";
import EmptyNonPrimitiveDisplay from "./empty-non-primitive-display";
import OpeningLineDisplay from "./opening-line-display";
import PrimitiveDisplay from "./primitive-display";
import isEmptyNonPrimitiveNode from "../utils/is-empty-non-primitive-node";
import isOpeningLineNode from "./utils/is-opening-line-node";
import { cn } from "@/lib/utils";

interface NodeRendererProps {
    node: FlattenedJSONNode;
    unflattenedValue: JSONValue;
    parent?: FlattenedJSONOpeningLine;
    grandparent?: FlattenedJSONOpeningLine;
    collapsed?: boolean;
    highlighted?: boolean;
    searchFocused?: boolean;
    onExpand?: (parentId: FlattenedJSONNode["id"]) => void;
    onCollapse?: (parentId: FlattenedJSONNode["id"]) => void;
    onUpdate?: ({
        updatedKey,
        updatedValue,
    }: {
        updatedKey: string;
        updatedValue: JSONValue;
    }) => void;
    onAdd?: ({
        updatedKey,
        updatedValue,
    }: {
        updatedKey: string;
        updatedValue: JSONValue;
    }) => void;
    onDelete?: () => void;
}

const HIGHLIGHTED_CLASSNAME = "bg-muted-foreground/25";
const SEARCH_FOCUSED_CLASSNAME = "bg-orange-400";
const BASE_CLASSNAME = "rounded-md pl-1";

export default function NodeRenderer({
    node,
    unflattenedValue,
    parent,
    grandparent,
    collapsed = false,
    highlighted = false,
    searchFocused = false,
    onExpand,
    onCollapse,
    onUpdate,
    onAdd,
    onDelete,
}: NodeRendererProps) {
    const marginLeft = node.depth * 24;

    if (isEmptyNonPrimitiveNode(node)) {
        return (
            <div
                style={{ marginLeft }}
                className={cn(
                    BASE_CLASSNAME,
                    highlighted && HIGHLIGHTED_CLASSNAME,
                    searchFocused && SEARCH_FOCUSED_CLASSNAME,
                )}
            >
                <EmptyNonPrimitiveDisplay
                    node={node}
                    unflattenedValue={unflattenedValue}
                    onUpdate={onUpdate}
                    onAdd={onAdd}
                    onDelete={onDelete}
                />
            </div>
        );
    }

    if (isOpeningLineNode(node)) {
        return (
            <div
                style={{ marginLeft }}
                className={cn(
                    BASE_CLASSNAME,
                    highlighted && HIGHLIGHTED_CLASSNAME,
                    searchFocused && SEARCH_FOCUSED_CLASSNAME,
                )}
            >
                <OpeningLineDisplay
                    node={node}
                    unflattenedValue={unflattenedValue}
                    onExpand={() => onExpand?.(node.id)}
                    onCollapse={() => onCollapse?.(node.id)}
                    collapsed={collapsed}
                    onUpdate={onUpdate}
                    onAdd={onAdd}
                    onDelete={onDelete}
                />
            </div>
        );
    }

    if (isClosingLineNode(node)) {
        return (
            <div
                style={{ marginLeft }}
                className={cn(
                    BASE_CLASSNAME,
                    highlighted && HIGHLIGHTED_CLASSNAME,
                    searchFocused && SEARCH_FOCUSED_CLASSNAME,
                )}
            >
                <ClosingLineDisplay
                    node={node}
                    grandparent={grandparent}
                    onAdd={onAdd}
                    onCollapse={() => onCollapse?.(node.parent)}
                />
            </div>
        );
    }

    if (isPrimitiveNode(node)) {
        return (
            <div
                style={{ marginLeft }}
                className={cn(
                    BASE_CLASSNAME,
                    highlighted && HIGHLIGHTED_CLASSNAME,
                    searchFocused && SEARCH_FOCUSED_CLASSNAME,
                )}
            >
                <PrimitiveDisplay
                    node={node}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onAdd={onAdd}
                    parent={parent}
                />
            </div>
        );
    }

    return null;
}
