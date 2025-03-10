import { FlattenedJSONNode, JSONValue } from "../types";
import flattenJSON from "./flattenJSON";

export default function updateNode(
	id: FlattenedJSONNode["id"],
	updatedKey: FlattenedJSONNode["key"],
	updatedValue: JSONValue,
	ids: FlattenedJSONNode["id"][],
	nodes: { [id: FlattenedJSONNode["id"]]: FlattenedJSONNode }
) {
	const currentNode = nodes[id];
	const currentNodeParent = currentNode.parent;

	const updatedNodes = flattenJSON({
		data: updatedKey ? { [updatedKey]: updatedValue } : updatedValue,
		depth: currentNode.depth - 1,
		parentPath: currentNode.path,
		wrapSymbols: !!currentNode.key,
		stringified: currentNode.stringified,
		parent: currentNode.parent,
	});

	delete nodes[id];
	updatedNodes.forEach((node) => (nodes[node.id] = node));

	if (currentNodeParent) {
		const indexOfCurrentNodeInParent =
			nodes[currentNodeParent].children.indexOf(id);

		nodes[currentNodeParent].children.splice(
			indexOfCurrentNodeInParent,
			1,
			...updatedNodes
				.filter((node) => node.depth === currentNode.depth) // only add direct children
				.map((node) => node.id)
		);
	}

	ids.splice(ids.indexOf(id), 1, ...updatedNodes.map((node) => node.id));

	return { ids, nodes };
}
