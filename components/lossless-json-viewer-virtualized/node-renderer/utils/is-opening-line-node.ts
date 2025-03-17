import { FlattenedJSONNode, FlattenedJSONOpeningLine } from "../../types";

export default function isOpeningLineNode(
    node: FlattenedJSONNode,
): node is FlattenedJSONOpeningLine {
    return (
        node.hasOwnProperty("openingSymbol") &&
        !!(node as FlattenedJSONOpeningLine).openingSymbol
    );
}
