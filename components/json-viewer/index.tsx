import NonPrimitiveDisplay from "./non-primitive-display";

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
    console.log(updatedValue);
    onChange?.(JSON.stringify(updatedValue, null, 2));
  }

  function handleDelete() {
    onChange?.("");
  }

  const result = safeParse(text);
  if (result === null) {
    return <pre>{text}</pre>;
  }

  return (
    <div className="ml-8 w-full">
      <NonPrimitiveDisplay
        value={result}
        trailingComma={false}
        onChange={handleChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
