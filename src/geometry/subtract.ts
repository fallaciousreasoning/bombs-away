import { Vertices } from "./vertices";
import Vector2 from "../core/vector2";
import { shortestDistanceToLine } from "./utils";

/**
 * Finds the closest edge i - i+1 in vertices to a point
 * and returns the index of the first vertex in that edge.
 * @param vertices The vertices
 * @param to The point
 */
const findClosestEdgeIndex = (vertices: Vector2[], to: Vector2) => {
    let shortestDistance = -1;
    let index = -1;

    for (let i = 0; i < vertices.length; ++i) {
        const start = vertices[i];
        const end = vertices[(i + 1) % vertices.length];

        const distance = shortestDistanceToLine(start, end, to);
        if (index === -1 || distance < shortestDistance) {
            shortestDistance = distance;
            index = i;
        }
    }

    return index;
}

/**
 * Subtracts second from first and returns the result.
 * If there is no overlap, this returns first.
 * @param first The polygon to subtract from.
 * @param second The polygon to subtract.
 */
const subtract = (first: Vertices, second: Vertices): Vertices => {
    // If the bounding boxes don't overlap, no point doing anything
    // expensive.
    if (!first.bounds.intersects(second.bounds)) {
        return first;
    }

    // Get all the points from second that are inside first.
    const containingPoints = second.vertices.filter(first.contains);

    // TODO: Case where all of first is inside second.
    // TODO: Case where the hull is split in two?

    // If there are no containing points, we don't have to change the shape.
    if (containingPoints.length === 0) {
        return first;
    }

    // Check there is a point outside our shape.
    if (containingPoints.length === second.vertices.length) {
        throw new Error("All points in second are inside first (can't make holes)");
    }

    // Make a copy of our vertices, so we don't modify first.
    let resultVertices = [...first.vertices];

    // Insert our new vertices.
    for (const vertex of second.vertices) {
        // Find closest edge.
        const closestEdgeIndex = findClosestEdgeIndex(resultVertices, vertex);

        // Insert in the middle of that edge.
        resultVertices.splice(closestEdgeIndex + 1, 0, vertex);
    }
    
    // TODO: Test if it works doing this before inserting new vertices.
    // Remove all the points from first that are inside second.
    resultVertices = resultVertices.filter(v => !second.contains(v));

    // Create a new vertices to hold our result.
    return new Vertices(resultVertices);
}