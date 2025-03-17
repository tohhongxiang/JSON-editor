"use client";

import { useMemo, useRef, useState } from "react";
import LineRenderer from "./line-renderer";
import flattenJSON from "./utils/flattenJSON";
import normalizeFlattenedJSONNodeArray from "./utils/normalize-flattened-json-node-array";
import getChildren from "./utils/get-children";
import safeJSONParse from "./utils/safe-json-parse";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { JSONValue } from "./types";
import unflattenJSON from "./utils/unflattenJSON";
import deleteNode from "./utils/delete-node";
import updateNode from "./utils/update-node";
import addNode from "./utils/add-node";
import getValueAtId from "./utils/get-value-at-id";

export default function JSONViewerVirtualized({
    text,
    onChange,
}: {
    text: string;
    onChange?: (updatedValue: string) => void;
}) {
    const [ids, nodes] = useMemo(
        () =>
            normalizeFlattenedJSONNodeArray(
                flattenJSON({ data: safeJSONParse(text) }),
            ),
        [text],
    );

    const [collapsed, setCollapsed] = useState(new Set<string>());
    const handleCollapse = (parent: string) => () => {
        setCollapsed((c) => {
            const updated = new Set([...c]);
            updated.add(parent);
            return updated;
        });
    };

    const handleExpand = (parent: string) => () => {
        setCollapsed((c) => {
            const updated = new Set([...c]);
            updated.delete(parent);
            return updated;
        });
    };

    const hiddenIds = new Set(
        [...collapsed]
            .map((collapsedId) => getChildren(nodes, collapsedId))
            .flat(),
    );

    const finalIds = ids.filter((id) => !hiddenIds.has(id));

    const scrollParentRef = useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
        count: finalIds.length,
        getScrollElement: () => scrollParentRef.current,
        estimateSize: () => 25,
        overscan: 25,
    });

    function handleEdit({
        updatedKey,
        updatedValue,
        id,
    }: {
        updatedKey: string;
        updatedValue: JSONValue;
        id: string;
        path: (string | number)[];
    }) {
        const { ids: updatedIds, nodes: updatedNodes } = updateNode(
            id,
            updatedKey,
            updatedValue,
            ids,
            nodes,
        );
        const updatedJSON = unflattenJSON(updatedIds, updatedNodes);

        onChange?.(JSON.stringify(updatedJSON, null, 2));
    }

    const handleDelete = (id: string) => () => {
        const { ids: updatedIds, nodes: updatedNodes } = deleteNode(
            id,
            ids,
            nodes,
        );

        onChange?.(
            JSON.stringify(unflattenJSON(updatedIds, updatedNodes), null, 2),
        );
    };

    const handleAdd =
        (id: string) =>
        ({
            updatedKey,
            updatedValue,
            updatedIndex = 0,
        }: {
            updatedKey: string;
            updatedValue: JSONValue;
            updatedIndex?: number;
        }) => {
            const { ids: updatedIds, nodes: updatedNodes } = addNode({
                id,
                updatedKey,
                updatedValue,
                indexToAddTo: updatedIndex,
                ids,
                nodes,
            });

            onChange?.(
                JSON.stringify(
                    unflattenJSON(updatedIds, updatedNodes),
                    null,
                    2,
                ),
            );
        };

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
                        const line = nodes[finalIds[virtualRow.index]];
                        const parent = line.parent
                            ? nodes[line.parent]
                            : undefined;

                        const indexInParent = parent
                            ? parent.children.indexOf(line.id)
                            : undefined;

                        const actualIndex =
                            parent && indexInParent !== undefined
                                ? parent.children
                                      .slice(0, indexInParent + 1) // get all children up to the current node
                                      .filter((id) => {
                                          // remove all the closing symbols
                                          if (!nodes[id].closingSymbol) {
                                              return true;
                                          }

                                          return nodes[id].openingSymbol;
                                      }).length - 1
                                : undefined;
                        return (
                            <div
                                key={virtualRow.key}
                                data-index={virtualRow.index}
                                ref={virtualizer.measureElement}
                                className="ml-8"
                            >
                                <LineRenderer
                                    node={line}
                                    unflattenedValue={getValueAtId(
                                        line.id,
                                        nodes,
                                    )}
                                    collapsed={collapsed.has(line.id)}
                                    onCollapse={handleCollapse(line.id)}
                                    onExpand={handleExpand(line.id)}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete(line.id)}
                                    onAdd={handleAdd(line.id)}
                                    numberOfChildren={
                                        line.children.filter(
                                            (childId) => !!nodes[childId].key,
                                        ).length
                                    }
                                    parent={parent}
                                    indexInParent={indexInParent}
                                    actualIndex={actualIndex}
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
