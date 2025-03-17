import isOpeningLineNode from "../node-renderer/utils/is-opening-line-node";
import { FlattenedJSONNode, JSONArray, JSONObject, JSONValue } from "../types";
import isEmptyNonPrimitiveNode from "./is-empty-non-primitive-node";
import unflattenJSON from "./unflatten-json";
import updateNode from "./update-node";

export default function addNode(
    id: FlattenedJSONNode["id"],
    indexToAddToInParent: number,
    updatedNode: {
        updatedKey: FlattenedJSONNode["id"];
        updatedValue: JSONValue;
    },
    existingNodes: {
        ids: FlattenedJSONNode["id"][];
        nodes: { [id: FlattenedJSONNode["id"]]: FlattenedJSONNode };
    },
) {
    const originNode = existingNodes.nodes[id];

    if (
        !isOpeningLineNode(originNode) &&
        !isEmptyNonPrimitiveNode(originNode)
    ) {
        throw new Error("Invalid origin node to add to");
    }

    let updatedValue = unflattenJSON(
        existingNodes.ids,
        existingNodes.nodes,
        id,
    ) as JSONObject | JSONArray;

    if (Array.isArray(updatedValue)) {
        updatedValue.splice(indexToAddToInParent, 0, updatedNode.updatedValue);
    } else {
        const updatedEntries = Object.entries(updatedValue); // to keep order of entries
        updatedEntries.splice(indexToAddToInParent, 0, [
            updatedNode.updatedKey,
            updatedNode.updatedValue,
        ]);
        updatedValue = Object.fromEntries(updatedEntries);
    }

    return updateNode(
        id,
        { updatedKey: originNode.key, updatedValue },
        existingNodes,
    );
}
