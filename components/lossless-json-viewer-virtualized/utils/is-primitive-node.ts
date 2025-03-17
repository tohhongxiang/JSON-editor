import { FlattenedJSONNode, FlattenedJSONPrimitiveLine } from "../types";

export default function isPrimitiveNode(
    node: FlattenedJSONNode,
): node is FlattenedJSONPrimitiveLine {
    return (
        node.hasOwnProperty("value") &&
        (node as FlattenedJSONPrimitiveLine).value !== undefined
    );
}
