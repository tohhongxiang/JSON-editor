export default function StringDisplay({ value }: { value: string }) {
  return (
    <pre className="text-green-500 font-bold">
      {'"'}
      {value}
      {'"'}
    </pre>
  );
}
