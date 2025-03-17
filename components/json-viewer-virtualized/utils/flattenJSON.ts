import { FlattenedJSONNode, JSONPrimitive, JSONValue } from "../types";
import { v4 as uuidv4 } from "uuid";

function isPrimitive(
    value: unknown,
): value is string | number | boolean | null {
    if (value === null) {
        return true;
    }
    return ["string", "boolean", "number"].includes(typeof value);
}

export default function flattenJSON({
    data,
    depth = 0,
    parentPath = ["$"],
    wrapSymbols = true,
    stringified = false,
    parent = null,
}: {
    data: JSONValue;
    depth?: number;
    parentPath?: (string | number)[];
    wrapSymbols?: boolean;
    stringified?: boolean;
    parent?: string | null;
}): FlattenedJSONNode[] {
    if (isPrimitive(data)) {
        if (typeof data === "string" && isValidStringifiedObject(data)) {
            return flattenJSON({
                data: JSON.parse(data),
                depth,
                parentPath,
                stringified: true,
                parent,
            });
        }

        return [
            generateLine({
                value: data,
                key: undefined,
                depth,
                path: parentPath,
                parent,
            }),
        ];
    }

    if (getNumberOfItems(data) === 0) {
        return [
            generateLine({
                openingSymbol: getOpeningSymbol(data),
                closingSymbol: getClosingSymbol(data),
                depth,
                path: parentPath,
                stringified,
                parent: parent,
            }),
        ];
    }

    let lines: FlattenedJSONNode[] = [];
    const openingLine = wrapSymbols
        ? generateLine({
              openingSymbol: getOpeningSymbol(data),
              depth,
              path: parentPath,
              stringified,
              parent,
          })
        : undefined;

    const closingLine = wrapSymbols
        ? generateLine({
              closingSymbol: getClosingSymbol(data),
              depth,
              path: parentPath,
              stringified,
              parent,
          })
        : undefined;

    let childLines: FlattenedJSONNode[] = [];
    const childIds: string[] = [];

    Object.entries(data).forEach(([key, unprocessedValue]) => {
        const isStringified =
            typeof unprocessedValue === "string" &&
            isValidStringifiedObject(unprocessedValue);

        const value = isStringified
            ? JSON.parse(unprocessedValue)
            : unprocessedValue;

        if (isPrimitive(value)) {
            const innerLine = generateLine({
                value,
                key,
                depth: depth + 1,
                path: [...parentPath, key],
                stringified: isStringified,
                parent: openingLine?.id ?? parent,
            });

            childLines.push(innerLine);
            childIds.push(innerLine.id);

            return;
        }

        if (getNumberOfItems(value) === 0) {
            const innerLine = generateLine({
                key,
                openingSymbol: getOpeningSymbol(value),
                closingSymbol: getClosingSymbol(value),
                depth: depth + 1,
                path: [...parentPath, key],
                stringified: isStringified,
                parent: openingLine?.id ?? parent,
            });

            childLines.push(innerLine);
            childIds.push(innerLine.id);

            return;
        }

        const innerOpeningLine = generateLine({
            key,
            openingSymbol: getOpeningSymbol(value),
            depth: depth + 1,
            path: [...parentPath, key],
            stringified: isStringified,
            parent: openingLine?.id ?? parent,
        });

        const innerLines = flattenJSON({
            data: value,
            depth: depth + 1,
            parentPath: [...parentPath, key],
            wrapSymbols: false,
            stringified: isStringified,
            parent: innerOpeningLine.id,
        });

        const innerClosingLine = generateLine({
            closingSymbol: getClosingSymbol(value),
            depth: depth + 1,
            path: [...parentPath, key],
            stringified: isStringified,
            parent: openingLine?.id ?? parent,
        });

        innerOpeningLine.children = [
            ...innerLines
                .filter((line) => line.depth === innerOpeningLine.depth + 1)
                .map((line) => line.id),
            innerClosingLine.id,
        ];
        childIds.push(innerOpeningLine.id);
        childIds.push(innerClosingLine.id);

        childLines.push(innerOpeningLine);
        childLines = childLines.concat(innerLines);
        childLines.push(innerClosingLine);
    });

    if (openingLine) {
        openingLine.children = [...openingLine.children, ...childIds];
    }

    if (closingLine && openingLine) {
        openingLine.children.push(closingLine.id);
    }

    if (openingLine) {
        lines.push(openingLine);
    }

    lines = lines.concat(childLines);

    if (closingLine) {
        lines.push(closingLine);
    }

    return lines;
}

function getOpeningSymbol(value: unknown) {
    if (Array.isArray(value)) {
        return "[";
    } else {
        return "{";
    }
}

function getClosingSymbol(value: unknown) {
    if (Array.isArray(value)) {
        return "]";
    } else {
        return "}";
    }
}

function getNumberOfItems(value: unknown) {
    if (Array.isArray(value)) {
        return value.length;
    }

    return Object.keys(value as object).length;
}

function isValidStringifiedObject(value: unknown) {
    if (typeof value !== "string") {
        return false;
    }

    const isPossiblyStringifiedArray =
        value.startsWith("[") && value.endsWith("]");
    const isPossiblyStringifiedObject =
        value.startsWith("{") && value.endsWith("}");

    if (!isPossiblyStringifiedArray && !isPossiblyStringifiedObject) {
        return false;
    }

    try {
        JSON.parse(value);
        return true;
    } catch {
        return false;
    }
}

export function generateLine({
    value,
    key,
    depth,
    path = [],
    children = [],
    openingSymbol,
    closingSymbol,
    stringified = false,
    parent,
}: {
    value?: JSONPrimitive;
    key?: string;
    depth: number;
    path?: (string | number)[];
    children?: string[];
    openingSymbol?: "{" | "[";
    closingSymbol?: "}" | "]";
    stringified?: boolean;
    parent?: string | null;
}) {
    return {
        id: uuidv4(),
        value,
        key,
        depth,
        path,
        children,
        openingSymbol,
        closingSymbol,
        stringified,
        parent,
    } as FlattenedJSONNode;
}
