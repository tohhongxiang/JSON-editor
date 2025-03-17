import { stringify } from "lossless-json";
import {
    FlattenedJSONEmptyNonPrimitiveLine,
    FlattenedJSONNode,
    FlattenedJSONOpeningLine,
    FlattenedJSONPrimitiveLine,
    JSONValue,
} from "../types";
import flattenJSON from "./flatten-json";
import getAllDescendants from "./get-all-descendants";
import unflattenJSON from "./unflatten-json";

export default function updateNode(
    id: FlattenedJSONNode["id"],
    updatedNodeData: { updatedKey: string; updatedValue: JSONValue },
    existingNodes: {
        ids: FlattenedJSONNode["id"][];
        nodes: { [id: string]: FlattenedJSONNode };
    },
) {
    const currentNode = existingNodes.nodes[id] as
        | FlattenedJSONOpeningLine
        | FlattenedJSONEmptyNonPrimitiveLine
        | FlattenedJSONPrimitiveLine; // we will not update closing lines

    if (currentNode === undefined) {
        throw new Error(`Node ${id} not found`);
    }

    // No update, do nothing
    if (
        stringify(updatedNodeData.updatedValue) ===
            stringify(
                unflattenJSON(existingNodes.ids, existingNodes.nodes, id),
            ) &&
        updatedNodeData.updatedKey === currentNode.key
    ) {
        return existingNodes;
    }

    // Copy all nodes to prevent modifying original
    let updatedIds = existingNodes.ids.map((id) => id);
    const updatedNodes = Object.fromEntries(
        Object.entries(existingNodes.nodes).map(([k, v]) => [k, { ...v }]),
    );

    // Remove all descendants from the id array since they are replaced
    const descendantsOfCurrentNode = getAllDescendants(
        currentNode.id,
        updatedIds,
        updatedNodes,
    );
    updatedIds = updatedIds.filter((id) => !descendantsOfCurrentNode.has(id));
    descendantsOfCurrentNode.forEach((id) => delete updatedNodes[id]);

    const newNodes = flattenJSON({
        data: updatedNodeData.updatedValue,
        key: updatedNodeData.updatedKey,
        depth: currentNode.depth,
        parent: currentNode.parent,
    });

    delete updatedNodes[id];
    newNodes.forEach((newNode) => (updatedNodes[newNode.id] = newNode));
    updatedIds.splice(
        updatedIds.indexOf(id),
        1,
        ...newNodes.map((newNode) => newNode.id),
    );

    // Have to update parent
    if (currentNode.parent) {
        updatedNodes[currentNode.parent].children.splice(
            updatedNodes[currentNode.parent].children.indexOf(id),
            1,
            newNodes[0].id,
        );
    }

    return { ids: updatedIds, nodes: updatedNodes };
}
