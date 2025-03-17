import isPrimitive from "./is-primitive";
import {
    FlattenedJSONClosingLine,
    FlattenedJSONEmptyNonPrimitiveLine,
    FlattenedJSONNode,
    FlattenedJSONOpeningLine,
    FlattenedJSONPrimitiveLine,
    JSONValue,
} from "../types";
import { v4 as uuidv4 } from "uuid";
import isEmptyNonPrimitive from "./is-empty-non-primitive";
import getClosingSymbol from "./get-closing-symbol";
import getOpeningSymbol from "./get-opening-symbol";
import isValidStringifiedObject from "./is-valid-stringified-object";
import { parse } from "lossless-json";

export default function flattenJSON({
    data,
    key,
    depth = 0,
    parent,
}: {
    data: JSONValue;
    key?: string;
    depth?: number;
    parent?: string;
}): FlattenedJSONNode[] {
    if (isValidStringifiedObject(data)) {
        const nodes = flattenJSON({
            data: parse(data) as JSONValue,
            key,
            depth,
            parent,
        });

        (
            nodes[0] as
                | FlattenedJSONOpeningLine
                | FlattenedJSONEmptyNonPrimitiveLine
        ).isStringified = true;

        return nodes;
    }

    if (isPrimitive(data)) {
        return [generateLine({ key, value: data, depth, parent })];
    }

    if (isEmptyNonPrimitive(data)) {
        return [
            generateLine({
                openingSymbol: getOpeningSymbol(data),
                closingSymbol: getClosingSymbol(data),
                depth,
                key,
                parent,
            }),
        ];
    }

    const openingSymbol = generateLine({
        key,
        openingSymbol: getOpeningSymbol(data),
        depth,
        parent,
    });

    const children = Array.isArray(data)
        ? data.map((child, index) =>
              flattenJSON({
                  key: index.toString(),
                  data: child,
                  depth: depth + 1,
                  parent: openingSymbol.id,
              }),
          )
        : Object.entries(data).map(([key, value]) =>
              flattenJSON({
                  key,
                  data: value,
                  depth: depth + 1,
                  parent: openingSymbol.id,
              }),
          );

    const closingSymbol = generateLine({
        closingSymbol: getClosingSymbol(data),
        depth,
        parent: openingSymbol.id,
    });

    openingSymbol.children = [
        ...children.map((child) => child[0].id),
        closingSymbol.id,
    ];

    return [openingSymbol, ...children.flat(), closingSymbol];
}

function generateLine({
    key,
    value,
    depth = 0,
    openingSymbol,
    closingSymbol,
    children = [],
    parent,
}: Omit<
    Partial<
        FlattenedJSONPrimitiveLine &
            FlattenedJSONOpeningLine &
            FlattenedJSONClosingLine &
            FlattenedJSONEmptyNonPrimitiveLine
    >,
    "id"
>): FlattenedJSONNode {
    return {
        id: uuidv4(),
        key,
        value,
        depth,
        openingSymbol,
        closingSymbol,
        children,
        parent,
    } as FlattenedJSONNode;
}
