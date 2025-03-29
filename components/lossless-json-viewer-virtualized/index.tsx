import { useEffect, useMemo, useRef } from "react";
import { FlattenedJSONNode, FlattenedJSONOpeningLine } from "./types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import NodeRenderer from "./node-renderer";
import unflattenJSON from "./utils/unflatten-json";
import isClosingLineNode from "./utils/is-closing-line-node";
import useFlattenedJSON from "./use-flattened-json";
import isPrimitiveNode from "./utils/is-primitive-node";
import convertValueIntoString from "./node-renderer/utils/convert-value-into-string";
import SearchBox from "./search-box";
import useSearchBox from "./search-box/use-search-box";

interface LosslessJSONVirtualizedViewerProps {
    text: string;
    onChange: (value: string) => void;
}

export default function LosslessJSONVirtualizedViewer({
    text,
    onChange,
}: LosslessJSONVirtualizedViewerProps) {
    const {
        ids,
        nodes,
        collapsedIds,
        finalShownIds,
        collapse: handleCollapse,
        expand: handleExpand,
        update: handleUpdate,
        add: handleAdd,
        delete: handleDelete,
    } = useFlattenedJSON({ text, onChange });

    const nodeArray = useMemo(() => Object.values(nodes), [nodes]);
    const {
        isOpen: isSearchBoxOpen,
        setIsOpen: setIsSearchBoxOpen,
        searchText,
        setSearchText,
        highlightIndex,
        setHighlightIndex,
        searchMatches,
    } = useSearchBox({
        data: nodeArray,
        getMatch: getSearchMatches,
    });

    const highlightedIds = new Set(searchMatches.map((node) => node.id));
    const searchFocusedId = searchMatches.map((node) => node.id)[
        highlightIndex
    ];

    const scrollParentRef = useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
        count: finalShownIds.length,
        getScrollElement: () => scrollParentRef.current,
        estimateSize: () => 25,
        overscan: 25,
    });
    useEffect(() => {
        if (!searchFocusedId || !searchText) return;

        virtualizer.scrollToIndex(finalShownIds.indexOf(searchFocusedId), {
            align: "center",
            behavior: "auto",
        });
    }, [virtualizer, searchFocusedId, finalShownIds, searchText]);

    const items = virtualizer.getVirtualItems();

    return (
        <ScrollArea
            ref={scrollParentRef}
            style={{
                height: `100%`,
                overflow: "auto",
            }}
        >
            <SearchBox
                isOpen={isSearchBoxOpen}
                onOpenChange={setIsSearchBoxOpen}
                value={searchText}
                onValueChange={setSearchText}
                numberOfResults={searchMatches.length}
                highlightedResultIndex={highlightIndex}
                onGoToNextResult={() =>
                    setHighlightIndex((c) => (c + 1) % searchMatches.length)
                }
                onGoToPreviousResult={() =>
                    setHighlightIndex(
                        (c) =>
                            (c - 1 + searchMatches.length) %
                            searchMatches.length,
                    )
                }
            />
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
                                    highlighted={
                                        isSearchBoxOpen &&
                                        highlightedIds.has(node.id)
                                    }
                                    searchFocused={
                                        isSearchBoxOpen &&
                                        searchFocusedId === node.id
                                    }
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

function getSearchMatches(searchText: string, data: FlattenedJSONNode[]) {
    if (searchText.length === 0) {
        return [];
    }

    return data.filter(
        (node) =>
            (!isClosingLineNode(node) && node.key?.includes(searchText)) ||
            (isPrimitiveNode(node) &&
                convertValueIntoString(node.value)?.includes(searchText)),
    );
}
