import { FlattenedJSONNode } from "../types";

export default function getAllDescendants(
    id: FlattenedJSONNode["id"],
    ids: FlattenedJSONNode["id"][],
    nodes: { [id: FlattenedJSONNode["id"]]: FlattenedJSONNode },
) {
    const result = new Set<FlattenedJSONNode["id"]>();

    nodes[id]?.children.forEach((childId) => {
        result.add(childId);
        getAllDescendants(childId, ids, nodes).forEach((descendantId) =>
            result.add(descendantId),
        );
    });

    return result;
}
