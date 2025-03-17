import { FlattenedJSONNode, JSONArray, JSONObject } from "../types";
import isClosingLineNode from "./is-closing-line-node";
import unflattenJSON from "./unflatten-json";
import updateNode from "./update-node";

export default function deleteNode(
    id: FlattenedJSONNode["id"],
    existingNodes: {
        ids: FlattenedJSONNode["id"][];
        nodes: { [id: FlattenedJSONNode["id"]]: FlattenedJSONNode };
    },
) {
    const originNode = existingNodes.nodes[id];
    if (isClosingLineNode(originNode)) {
        throw new Error("Invalid origin node for deleting");
    }

    if (!originNode.parent) {
        // no parent means we are deleting the root node
        return { ids: [], nodes: {} };
    }

    const parentNode = existingNodes.nodes[originNode.parent];
    if (isClosingLineNode(parentNode)) {
        throw new Error(
            `Invalid parent node: Should not be a closing line node`,
        );
    }

    let newValue = unflattenJSON(
        existingNodes.ids,
        existingNodes.nodes,
        parentNode.id,
    ) as JSONArray | JSONObject;

    if (Array.isArray(newValue)) {
        const indexToRemove = parentNode.children.indexOf(originNode.id);
        newValue = newValue.filter((_, index) => index !== indexToRemove);
    } else {
        delete newValue[originNode.key];
    }

    console.log("New value", newValue);
    return updateNode(
        parentNode.id,
        { updatedKey: parentNode.key, updatedValue: newValue },
        existingNodes,
    );
}
