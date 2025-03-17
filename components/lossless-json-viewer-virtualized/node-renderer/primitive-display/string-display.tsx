export default function StringDisplay({ value }: { value: string }) {
    return (
        <pre className="font-bold text-green-500">
            {'"'}
            {value}
            {'"'}
        </pre>
    );
}
