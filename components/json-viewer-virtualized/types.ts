export type Primitive = string | number | boolean | null;
export type NonPrimitive = Record<string, unknown> | unknown[];

export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONPrimitive = string | number | boolean | null;
export type JSONObject = { [key: string]: JSONValue };
export type JSONArray = JSONValue[];

export type OpeningSymbol = "{" | "[";
export type ClosingSymbol = "}" | "]";

interface LeafJSONNode {
    id: string;
    key: string;
    value: JSONPrimitive;
    depth: number;
    path: (string | number)[];
    openingSymbol: undefined;
    closingSymbol: undefined;
    children: string[];
    stringified?: boolean;
    parent?: string | null;
}

interface EmptyObjectJSONNode {
    id: string;
    key?: string;
    value: undefined;
    depth: number;
    path: (string | number)[];
    openingSymbol: "{";
    closingSymbol: "}";
    children: string[];
    stringified?: boolean;
    parent?: string | null;
}

interface EmptyArrayJSONNode {
    id: string;
    key?: string;
    value: undefined;
    depth: number;
    path: (string | number)[];
    openingSymbol: "[";
    closingSymbol: "]";
    children: string[];
    stringified?: boolean;
    parent?: string | null;
}

interface OpeningLineJSONNode {
    id: string;
    key?: string;
    value: undefined;
    depth: number;
    path: (string | number)[];
    openingSymbol: OpeningSymbol;
    closingSymbol: undefined;
    children: string[];
    stringified?: boolean;
    parent?: string | null;
}

interface ClosingLineJSONNode {
    id: string;
    key: undefined;
    value: undefined;
    depth: number;
    path: (string | number)[];
    openingSymbol: undefined;
    closingSymbol: ClosingSymbol;
    children: string[];
    stringified?: boolean;
    parent?: string | null;
}

export type FlattenedJSONNode =
    | LeafJSONNode
    | EmptyObjectJSONNode
    | EmptyArrayJSONNode
    | OpeningLineJSONNode
    | ClosingLineJSONNode;

// export interface FlattenedJSONNode {
// 	id: string;
// 	key?: string;
// 	value?: JSONPrimitive;
// 	depth: number;
// 	path: (string | number)[];
// 	openingSymbol?: OpeningSymbol;
// 	closingSymbol?: ClosingSymbol;
// 	children: string[];
// 	stringified?: boolean;
// 	parent?: string | null;
// }
