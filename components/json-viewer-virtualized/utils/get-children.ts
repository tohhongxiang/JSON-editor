import { FlattenedJSONNode } from "../types";

/**
 * Gets all direct/indirect children of a node
 */
export default function getChildren(
    nodes: { [key: string]: FlattenedJSONNode },
    id: string,
) {
    const queue = [nodes[id]];
    const children: string[] = [];
    let index = 0; // Use an index pointer instead of shift()

    while (index < queue.length) {
        const node = queue[index++];
        if (!node) {
            continue;
        }

        children.push(...node.children);
        queue.push(...node.children.map((childId) => nodes[childId]));
    }

    return children;
}
