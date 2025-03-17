import {
    FlattenedJSONEmptyNonPrimitiveLine,
    FlattenedJSONNode,
} from "../types";

export default function isEmptyNonPrimitiveNode(
    node: FlattenedJSONNode,
): node is FlattenedJSONEmptyNonPrimitiveLine {
    return (
        node.hasOwnProperty("openingSymbol") &&
        node.hasOwnProperty("closingSymbol") &&
        !!(node as FlattenedJSONEmptyNonPrimitiveLine).openingSymbol &&
        !!(node as FlattenedJSONEmptyNonPrimitiveLine).closingSymbol
    );
}
