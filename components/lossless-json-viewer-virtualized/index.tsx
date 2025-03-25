import { useEffect, useRef, useState } from "react";
import { FlattenedJSONOpeningLine } from "./types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import NodeRenderer from "./node-renderer";
import unflattenJSON from "./utils/unflatten-json";
import isClosingLineNode from "./utils/is-closing-line-node";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import useFlattenedJSON from "./use-flattened-json";
import isPrimitiveNode from "./utils/is-primitive-node";
import convertValueIntoString from "./node-renderer/utils/convert-value-into-string";

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

    const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [highlightIndex, setHighlightIndex] = useState(0);
    useEffect(() => {
        setHighlightIndex(0);
    }, [searchText, text]);
    const highlightSearchResults =
        searchText.length > 0
            ? Object.values(nodes).filter(
                  (node) =>
                      (!isClosingLineNode(node) &&
                          node.key?.includes(searchText)) ||
                      (isPrimitiveNode(node) &&
                          convertValueIntoString(node.value)?.includes(
                              searchText,
                          )),
              )
            : [];
    const highlightedIds = new Set(
        highlightSearchResults.map((node) => node.id),
    );
    const searchFocusedId = highlightSearchResults.map((node) => node.id)[
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
            {isSearchBoxOpen ? (
                <div className="absolute right-2 top-0 z-10 flex flex-row items-center justify-center gap-2 rounded-md border bg-white px-4 py-2 pr-0">
                    <Input
                        placeholder="Search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    {searchText.length > 0 && (
                        <div>
                            <p className="font-light text-muted-foreground">
                                {highlightSearchResults.length === 0
                                    ? `0/0`
                                    : `${highlightIndex + 1}/${highlightSearchResults.length}`}
                            </p>
                        </div>
                    )}
                    <div className="flex flex-row">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                setHighlightIndex(
                                    (c) =>
                                        (c -
                                            1 +
                                            highlightSearchResults.length) %
                                        highlightSearchResults.length,
                                )
                            }
                        >
                            <ChevronUp />
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() =>
                                setHighlightIndex(
                                    (c) =>
                                        (c + 1) % highlightSearchResults.length,
                                )
                            }
                        >
                            <ChevronDown />
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsSearchBoxOpen(false)}
                        >
                            <X />
                        </Button>
                    </div>
                </div>
            ) : (
                <Button
                    className="absolute right-2 top-0 z-10"
                    variant="secondary"
                    onClick={() => setIsSearchBoxOpen(true)}
                >
                    <Search />
                </Button>
            )}
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
