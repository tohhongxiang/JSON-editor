import { FlattenedJSONNode } from "../types";

export default function normalizeFlattenedJSONNodeArray(
	jsonNodes: FlattenedJSONNode[]
) {
	const ids: string[] = [];
	const nodes: { [key: string]: FlattenedJSONNode } = {};

	jsonNodes.forEach((node) => {
		ids.push(node.id);
		nodes[node.id] = node;
	});

	return [ids, nodes] as const;
}
