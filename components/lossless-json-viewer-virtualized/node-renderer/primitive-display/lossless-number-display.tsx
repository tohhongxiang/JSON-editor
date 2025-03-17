import { LosslessNumber } from "lossless-json";

export default function LosslessNumberDisplay({
    value,
}: {
    value: LosslessNumber;
}) {
    return <pre className="font-semibold text-purple-500">{value.value}</pre>;
}
