import { stringify } from "lossless-json";
import {
    FlattenedJSONEmptyNonPrimitiveLine,
    FlattenedJSONNode,
    FlattenedJSONOpeningLine,
    FlattenedJSONPrimitiveLine,
    JSONArray,
    JSONObject,
    JSONValue,
} from "../types";
import isClosingLineNode from "./is-closing-line-node";
import isPrimitiveNode from "./is-primitive-node";

export default function unflattenJSON(
    ids: FlattenedJSONNode["id"][],
    nodes: { [id: FlattenedJSONNode["id"]]: FlattenedJSONNode },
    rootId?: FlattenedJSONNode["id"],
): JSONValue {
    if (ids.length === 0 && Object.keys(nodes).length === 0) {
        return "";
    }

    function buildNode(nodeId: string): JSONValue {
        const node = nodes[nodeId] as
            | FlattenedJSONPrimitiveLine
            | FlattenedJSONOpeningLine
            | FlattenedJSONEmptyNonPrimitiveLine;
        if (!node) return null;

        // If the node has a value, return it directly
        if (isPrimitiveNode(node)) {
            return node.value;
        }

        // If the node is an object or array, initialize accordingly
        const isArray = node.openingSymbol === "[";
        let container: JSONObject | JSONArray | string = isArray ? [] : {};

        // Recursively build children
        for (const childId of node.children) {
            const childNode = nodes[childId];
            if (!childNode) {
                continue;
            }

            if (isClosingLineNode(childNode)) {
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

        if (node.isStringified) {
            container = stringify(container)!;
        }

        return container;
    }

    const rootNodeId = rootId ?? ids.find((id) => nodes[id].depth === 0);
    if (!rootNodeId) throw new Error("Invalid input: no root node found");
    return buildNode(rootNodeId);
}
