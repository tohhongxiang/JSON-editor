import { FlattenedJSONNode, JSONValue } from "../types";
import flattenJSON, { generateLine } from "./flattenJSON";

export default function addNode({
    id,
    updatedKey,
    updatedValue,
    indexToAddTo = 0,
    ids,
    nodes,
}: {
    id: FlattenedJSONNode["id"];
    updatedKey: FlattenedJSONNode["key"];
    updatedValue: JSONValue;
    indexToAddTo?: number;
    ids: FlattenedJSONNode["id"][];
    nodes: { [id: FlattenedJSONNode["id"]]: FlattenedJSONNode };
}) {
    let parentId = id;
    let parent = nodes[id];

    // in this case, id refers to the node that is supposed to be before the addedNode, not the parent. We have to find the parent
    if (indexToAddTo > 0) {
        parentId = parent.parent!;
        parent = nodes[parentId];
    }

    const indexOfParent = ids.indexOf(id);

    // empty array/object must split
    if (parent.openingSymbol && parent.closingSymbol) {
        const closingLine = generateLine({
            value: parent.value,
            depth: parent.depth,
            closingSymbol: parent.closingSymbol,
            path: parent.path,
            parent: parent.parent,
        });

        const openingLine = generateLine({
            value: parent.value,
            depth: parent.depth,
            openingSymbol: parent.openingSymbol,
            parent: parent.parent,
            path: parent.path,
            key: parent.key,
            children: [closingLine.id],
        });

        // delete the parent, and insert the 2 new lines
        ids.splice(indexOfParent, 1, openingLine.id, closingLine.id);
        delete nodes[id];
        nodes[openingLine.id] = openingLine;
        nodes[closingLine.id] = closingLine;

        parent = openingLine;
        parentId = openingLine.id;

        // update the parent's parent to include these 2 new lines
        if (parent.parent) {
            const indexInChildren = nodes[parent.parent].children.indexOf(id);
            nodes[parent.parent].children.splice(
                indexInChildren,
                1,
                openingLine.id,
                closingLine.id,
            );
        }
    }

    const addedNodes = flattenJSON({
        data: updatedKey ? { [updatedKey]: updatedValue } : updatedValue,
        depth: parent.depth - 1,
        parentPath: parent.path,
        wrapSymbols: false,
        stringified: parent.stringified,
        parent: parent.parent,
    });

    if (addedNodes.length === 1) {
        addedNodes[0].depth += 1;
    }

    // add to node map
    addedNodes.forEach((node) => (nodes[node.id] = node));

    // add at the correct index
    nodes[parent.id].children.splice(
        indexToAddTo,
        0,
        ...addedNodes
            .filter((node) => node.depth === parent.depth + 1)
            .map((node) => node.id),
    );

    // update the indexes
    if (nodes[parentId].openingSymbol === "[") {
        nodes[parentId].children
            .filter(
                (childId) => nodes[childId].depth === nodes[parentId].depth + 1,
            )
            .filter((childId) => {
                if (!nodes[childId].closingSymbol) return true;
                return nodes[childId].openingSymbol;
            })
            .forEach((childId, index) => {
                nodes[childId].key = index.toString();
            });
    }

    // insert child at the correct index after the parent opening line
    ids.splice(
        indexOfParent + indexToAddTo + 1,
        0,
        ...addedNodes.map((node) => node.id),
    );

    return { ids, nodes };
}
