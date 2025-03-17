import {
    FlattenedJSONClosingLine,
    FlattenedJSONNode,
    FlattenedJSONOpeningLine,
} from "../types";

export default function isClosingLineNode(
    node: FlattenedJSONNode,
): node is FlattenedJSONClosingLine {
    // must have a closing symbol, must not have an opening symbol
    return (
        !!(node as FlattenedJSONClosingLine).closingSymbol &&
        !(node as FlattenedJSONOpeningLine).openingSymbol
    );
}
