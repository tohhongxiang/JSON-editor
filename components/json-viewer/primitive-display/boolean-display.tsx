export default function BooleanDisplay({ value }: { value: boolean }) {
  return (
    <pre className="text-purple-500 font-bold">{value ? "true" : "false"}</pre>
  );
}
