export default function BooleanDisplay({ value }: { value: boolean }) {
    return (
        <pre className="font-bold text-purple-500">
            {value ? "true" : "false"}
        </pre>
    );
}
