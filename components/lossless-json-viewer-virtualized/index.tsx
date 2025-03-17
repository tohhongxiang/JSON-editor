import { useMemo, useRef, useState } from "react";
import {
    FlattenedJSONNode,
    FlattenedJSONOpeningLine,
    JSONValue,
} from "./types";
import flattenJSON from "./utils/flatten-json";
import safeJSONParse from "./utils/safe-json-parse";
import { useVirtualizer } from "@tanstack/react-virtual";
import normalizeFlattenedJSONNodeArray from "./utils/normalize-flattened-json-nodes";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import NodeRenderer from "./node-renderer";
import getAllDescendants from "./utils/get-all-descendants";
import updateNode from "./utils/update-node";
import unflattenJSON from "./utils/unflatten-json";
import { stringify } from "lossless-json";
import isOpeningLineNode from "./node-renderer/utils/is-opening-line-node";
import addNode from "./utils/add-node";
import deleteNode from "./utils/delete-node";
import isPrimitiveNode from "./utils/is-primitive-node";

interface LosslessJSONVirtualizedViewerProps {
    text: string;
    onChange: (value: string) => void;
}

export default function LosslessJSONVirtualizedViewer({
    text,
    onChange,
}: LosslessJSONVirtualizedViewerProps) {
    const [ids, nodes] = useMemo(
        () =>
            normalizeFlattenedJSONNodeArray(
                flattenJSON({ data: safeJSONParse(text) as JSONValue }),
            ),
        [text],
    );

    const [collapsedIds, setCollapsedIds] = useState(
        new Set<FlattenedJSONNode["id"]>(),
    );
    const handleCollapse = (id: FlattenedJSONNode["id"]) => {
        setCollapsedIds(
            (prev) =>
                new Set(
                    [...prev, id].filter(
                        (collapsedId) => nodes[collapsedId] !== undefined,
                    ),
                ),
        );
    };
    const handleExpand = (id: FlattenedJSONNode["id"]) => {
        setCollapsedIds(
            (prev) =>
                new Set(
                    [...prev].filter(
                        (hiddenId) =>
                            hiddenId !== id && nodes[hiddenId] !== undefined,
                    ),
                ),
        );
    };

    const handleUpdate =
        (id: FlattenedJSONNode["id"]) =>
        (updatedNode: { updatedKey: string; updatedValue: JSONValue }) => {
            const { ids: updatedIds, nodes: updatedNodes } = updateNode(
                id,
                updatedNode,
                { ids, nodes },
            );

            console.log(
                ids.map((id) => nodes[id]),
                unflattenJSON(updatedIds, updatedNodes),
                stringify(unflattenJSON(updatedIds, updatedNodes)),
            );
            onChange?.(
                stringify(unflattenJSON(updatedIds, updatedNodes), null, 2)!,
            );
        };

    const handleAdd =
        (id: FlattenedJSONNode["id"]) =>
        (updatedNode: { updatedKey: string; updatedValue: JSONValue }) => {
            const originNode = nodes[id];
            console.log(originNode);
            if (isOpeningLineNode(originNode)) {
                const { ids: updatedIds, nodes: updatedNodes } = addNode(
                    originNode.id,
                    0,
                    updatedNode,
                    { ids, nodes },
                );

                onChange?.(
                    stringify(
                        unflattenJSON(updatedIds, updatedNodes),
                        null,
                        2,
                    )!,
                );
            } else if (isPrimitiveNode(originNode)) {
                const parentNode = originNode.parent
                    ? nodes[originNode.parent]
                    : undefined;
                if (!parentNode)
                    throw new Error(
                        "Parent node not found when adding to primitive node",
                    );

                const { ids: updatedIds, nodes: updatedNodes } = addNode(
                    parentNode.id,
                    parentNode.children.indexOf(originNode.id) + 1,
                    updatedNode,
                    { ids, nodes },
                );

                onChange?.(
                    stringify(
                        unflattenJSON(updatedIds, updatedNodes),
                        null,
                        2,
                    )!,
                );
            } else {
                const parentNode = nodes[originNode.parent];
                if (!parentNode)
                    throw new Error(
                        "Parent node not found when adding to closing symbol",
                    );

                const grandparentId = parentNode.parent;
                const grandparentNode = grandparentId
                    ? nodes[grandparentId]
                    : undefined;
                if (!grandparentNode)
                    throw new Error(
                        "Grandparent node not found when adding to closing symbol",
                    );

                const { ids: updatedIds, nodes: updatedNodes } = addNode(
                    grandparentNode.id,
                    grandparentNode.children.indexOf(parentNode.id) + 1,
                    updatedNode,
                    { ids, nodes },
                );

                onChange?.(
                    stringify(
                        unflattenJSON(updatedIds, updatedNodes),
                        null,
                        2,
                    )!,
                );
            }
        };

    const handleDelete = (id: FlattenedJSONNode["id"]) => () => {
        const originNode = nodes[id];
        const { ids: updatedIds, nodes: updatedNodes } = deleteNode(
            originNode.id,
            { ids, nodes },
        );

        onChange?.(
            stringify(unflattenJSON(updatedIds, updatedNodes), null, 2)!,
        );
    };

    const hiddenIds = new Set(
        [...collapsedIds]
            .map((id) => [...getAllDescendants(id, ids, nodes)])
            .flat(),
    );
    const finalShownIds = ids.filter((id) => !hiddenIds.has(id));

    const scrollParentRef = useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
        count: finalShownIds.length,
        getScrollElement: () => scrollParentRef.current,
        estimateSize: () => 25,
        overscan: 25,
    });

    const items = virtualizer.getVirtualItems();
    return (
        <ScrollArea
            ref={scrollParentRef}
            style={{
                height: `100%`,
                overflow: "auto",
            }}
        >
            <div
                style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${items[0]?.start ?? 0}px)`,
                    }}
                >
                    {items.map((virtualRow) => {
                        const node = nodes[finalShownIds[virtualRow.index]];
                        const nodeParent = node.parent
                            ? nodes[node.parent]
                            : undefined;
                        const nodeGrandparent = nodeParent?.parent
                            ? nodes[nodeParent.parent]
                            : undefined;

                        const unflattenedValue = unflattenJSON(
                            ids,
                            nodes,
                            node.id,
                        );

                        return (
                            <div className="ml-10" key={virtualRow.key}>
                                <NodeRenderer
                                    node={node}
                                    unflattenedValue={unflattenedValue}
                                    onCollapse={handleCollapse}
                                    onExpand={handleExpand}
                                    collapsed={collapsedIds.has(node.id)}
                                    onUpdate={handleUpdate(node.id)}
                                    onAdd={handleAdd(node.id)}
                                    onDelete={handleDelete(node.id)}
                                    parent={
                                        nodeParent as
                                            | FlattenedJSONOpeningLine
                                            | undefined
                                    }
                                    grandparent={
                                        nodeGrandparent as
                                            | FlattenedJSONOpeningLine
                                            | undefined
                                    }
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
