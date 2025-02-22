import NonPrimitiveDisplay from "./non-primitive-display";
import isPrimitive from "./non-primitive-display/is-primitive";
import PrimitiveDisplay from "./primitive-display";

function safeParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default function JSONViewer({
  text,
  onChange,
}: {
  text: string;
  onChange?: (updatedValue: string) => void;
}) {
  function handleChange({
    updatedValue,
  }: {
    updatedKey: string;
    updatedValue: unknown;
  }) {
    onChange?.(JSON.stringify(updatedValue, null, 2));
  }

  function handleDelete() {
    onChange?.("");
  }

  const result = safeParse(text);
  if (result === null) {
    return <pre>{text}</pre>;
  }

  if (isPrimitive(result)) {
    return (
      <div className="px-2">
        <PrimitiveDisplay
          value={result}
          trailingComma={false}
          onChange={handleChange}
          onDelete={handleDelete}
        />
      </div>
    );
  }
  return (
    <div className="ml-10">
      <NonPrimitiveDisplay
        value={result}
        trailingComma={false}
        onChange={handleChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
