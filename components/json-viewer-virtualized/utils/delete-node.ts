import { FlattenedJSONNode } from "../types";

export default function deleteNode(
    id: string,
    ids: string[],
    nodes: { [id: string]: FlattenedJSONNode },
): { ids: string[]; nodes: { [id: string]: FlattenedJSONNode } } {
    const parentNodeId = nodes[id].parent;

    function deleteNodeAndChildren(nodeId: string): void {
        const node = nodes[nodeId];
        if (!node) return;

        // Recursively delete children
        for (const childId of node.children) {
            deleteNodeAndChildren(childId);
        }

        // Delete the node itself
        delete nodes[nodeId];
    }

    deleteNodeAndChildren(id);

    // Filter out deleted ids
    const updatedIds = ids.filter((nodeId) => nodes[nodeId] !== undefined);

    if (parentNodeId && nodes[parentNodeId]) {
        nodes[parentNodeId].children = nodes[parentNodeId].children
            .filter((childId) => childId !== id)
            .filter((childId) => nodes[childId] !== undefined);

        if (nodes[parentNodeId].openingSymbol === "[") {
            nodes[parentNodeId].children
                .filter((id) => nodes[id].key)
                .forEach((childId, index) => {
                    nodes[childId].key = index.toString();
                });
        }
    }

    return { ids: updatedIds, nodes };
}
