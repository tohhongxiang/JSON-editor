import NonPrimitiveDisplay from ".";
import PrimitiveDisplay from "../primitive-display";
import { NonPrimitive } from "../types";
import isPrimitive from "./is-primitive";
import tryConvertToObject from "./try-convert-to-object";

export default function MiddleLine({
  value,
  onChange,
  onDelete,
}: {
  value: NonPrimitive;
  onChange?: (
    { updatedKey, updatedValue }: { updatedKey: string; updatedValue: unknown },
    location: string | number
  ) => void;
  onDelete?: (location: string | number) => void;
}) {
  if (
    // empty object and array
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && Object.entries(value).length === 0)
  ) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((v, index) => (
      <RenderMiddleLineElement
        index={index}
        value={v}
        trailingComma={index < value.length - 1}
        key={index}
        onChange={onChange}
        onDelete={onDelete}
      />
    ));
  }

  const keyValuePairs = Object.entries(value);
  return keyValuePairs.map(([k, v], index) => (
    <RenderMiddleLineElement
      keyString={k}
      value={v}
      trailingComma={index < keyValuePairs.length - 1}
      key={k}
      onChange={onChange}
      onDelete={onDelete}
    />
  ));
}

function RenderMiddleLineElement({
  keyString,
  index,
  value,
  trailingComma,
  onChange,
  onDelete,
}: {
  keyString?: string;
  index?: number;
  value: unknown;
  trailingComma?: boolean;
  onChange?: (
    {
      updatedKey,
      updatedValue,
    }: {
      updatedKey: string;
      updatedValue: unknown;
    },
    location: string | number
  ) => void;
  onDelete?: (location: string | number) => void;
}) {
  const location = keyString ?? index ?? 0;

  if (isPrimitive(value)) {
    if (typeof value !== "string") {
      // if not string, won't be stringified object
      return (
        <PrimitiveDisplay
          keyString={keyString}
          value={value}
          trailingComma={trailingComma}
          onChange={(updated) => onChange?.(updated, location)}
          onDelete={() => onDelete?.(location)}
        />
      );
    }

    const finalV = tryConvertToObject(value); // check if stringified object, and display accordingly
    if (typeof finalV === "string") {
      return (
        <PrimitiveDisplay
          keyString={keyString}
          value={finalV}
          trailingComma={trailingComma}
          onChange={(updated) => onChange?.(updated, location)}
          onDelete={() => onDelete?.(location)}
        />
      );
    }

    return (
      <NonPrimitiveDisplay
        keyString={keyString}
        value={finalV}
        trailingComma={trailingComma}
        onChange={({ updatedKey, updatedValue }) =>
          onChange?.(
            {
              updatedKey: updatedKey,
              updatedValue: JSON.stringify(updatedValue),
            },
            location
          )
        }
        onDelete={() => onDelete?.(location)}
      />
    );
  }

  return (
    <NonPrimitiveDisplay
      keyString={keyString}
      value={value as NonPrimitive}
      trailingComma={trailingComma}
      onChange={(updatedValue) => onChange?.(updatedValue, location)}
      onDelete={() => onDelete?.(location)}
    />
  );
}
