import { Vertices } from "./vertices";
import Vector2 from "../core/vector2";
import { shortestDistanceToLine, lineIntersection } from "./utils";

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
export const subtract = (first: Vertices, second: Vertices): Vertices => {
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
    for (const vertex of containingPoints) {
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

/**
 * Determines the edge, if any, that this line will intersect with
 * and the index of the edge it intersects with.
 * @param shape The shape to determine intersection with.
 * @param start The start of the line
 * @param end The edge of the line
 * @param startInside 
 */
const intersectionIndex = (shape: Vertices, start: Vector2, end: Vector2) => {
    for (let i = 0; i < shape.vertices.length; ++i) {
        const edgeStart = shape.vertices[i];
        const edgeEnd = shape.vertices[(i + 1)%shape.vertices.length];

        const intersection = lineIntersection(edgeStart, edgeEnd, start, end);
        if (!intersection) {
            continue;
        }

        return {
            index: i,
            intersection
        };
    }
}

export const betterSubtract = (first: Vertices, second: Vertices) => {
    // Naively assume that we aren't going to cut the shape in half.
    // hopefully we can work around this (more than two intersections means we're cutting) (maybe cut with closest line to centroid?)

    // For each edge:
        // Does it intersect with our shape? (<-- Candidate for optimization?)
            // First intersection? Make a cut, set flag.
            // Second intersection? Make a cut, break

        // Have we made a cut?
            // Insert our vertex

    const result = [...first.vertices];

    for (let i = 0; i < second.vertices.length; ++i) {
        const start = second.vertices[i];
        const end = second.vertices[(i + 1) % second.vertices.length];

        const intersection = intersectionIndex(first, start, end);
        if (!intersection) {
            continue;
        }
        console.log(intersection);
        result.splice(intersection.index, 0, intersection.intersection);
        window['debugPoints'].push(intersection.intersection);
    }

    return new Vertices(result);
}