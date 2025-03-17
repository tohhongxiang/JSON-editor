import { FlattenedJSONNode, JSONArray, JSONObject, JSONValue } from "../types";

export default function unflattenJSON(
    ids: FlattenedJSONNode["id"][],
    nodes: { [id: FlattenedJSONNode["id"]]: FlattenedJSONNode },
    rootId?: FlattenedJSONNode["id"],
): JSONValue {
    if (ids.length === 0 || Object.keys(nodes).length === 0) {
        return "";
    }

    function buildNode(nodeId: string): JSONValue {
        const node = nodes[nodeId];
        if (!node) return null;

        // If the node has a value, return it directly
        if (node.value !== undefined) return node.value;

        // If the node is an object or array, initialize accordingly
        const isArray = node.openingSymbol === "[";
        let container: JSONObject | JSONArray | string = isArray ? [] : {};

        // Recursively build children
        for (const childId of node.children) {
            const childNode = nodes[childId];
            if (!childNode) {
                continue;
            }

            if (childNode.closingSymbol && !childNode.openingSymbol) {
                // ignore the closing symbols
                continue;
            }

            const key = isArray ? Number(childNode.key) : childNode.key;
            if (key === undefined || Number.isNaN(key)) continue;

            if (isArray) {
                (container as JSONArray)[key as number] = buildNode(childId);
            } else {
                (container as JSONObject)[key as string] = buildNode(childId);
            }
        }

        if (node.stringified) {
            container = JSON.stringify(container);
        }

        return container;
    }

    const root = rootId ?? ids.find((id) => nodes[id].depth === 0);
    if (!root) throw new Error("No root node found");
    return buildNode(root);
}
