import { LosslessNumber } from "lossless-json";

export type JSONPrimitive = number | boolean | null | string | LosslessNumber;
export type JSONArray = Array<JSONPrimitive | JSONArray | JSONObject>;
export type JSONObject = {
    [key: string]: JSONObject | JSONArray | JSONPrimitive;
};
export type JSONValue = JSONPrimitive | JSONArray | JSONObject;

export type FlattenedJSONNode =
    | FlattenedJSONPrimitiveLine
    | FlattenedJSONOpeningLine
    | FlattenedJSONClosingLine
    | FlattenedJSONEmptyNonPrimitiveLine;

type FlattenedJSONBase = {
    id: string;
    depth: number;
    children: string[];
};

export type FlattenedJSONPrimitiveLine = {
    key: string;
    value: JSONPrimitive;
    parent?: string;
} & FlattenedJSONBase;

export type OpeningSymbol = "{" | "[";
export type ClosingSymbol = "}" | "]";

export type FlattenedJSONOpeningLine = {
    key: string;
    openingSymbol: OpeningSymbol;
    isStringified?: boolean;
    parent?: string;
} & FlattenedJSONBase;

export type FlattenedJSONClosingLine = {
    closingSymbol: ClosingSymbol;
    parent: string;
} & FlattenedJSONBase;

export type FlattenedJSONEmptyNonPrimitiveLine = {
    key: string;
    openingSymbol: OpeningSymbol;
    closingSymbol: ClosingSymbol;
    isStringified?: boolean;
    parent?: string;
} & FlattenedJSONBase;
