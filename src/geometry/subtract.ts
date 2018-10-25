import { Vertices } from "./vertices";
import Vector2 from "../core/vector2";
import { shortestDistanceToLine, lineIntersection, isLeft } from "./utils";

interface IntersectionInfo {
    shapeEdgeIndex: number;
    removeEdgeIndex?: number;

    startInside: boolean;

    intercept: Vector2;
}

/**
 * Determines the edge, if any, that this line will intersect with
 * and the index of the edge it intersects with.
 * @param shape The shape to determine intersection with.
 * @param start The start of the line
 * @param end The edge of the line
 */
const getIntersectionInfo = (shape: Vertices, start: Vector2, end: Vector2): IntersectionInfo => {
    for (let i = 0; i < shape.vertices.length; ++i) {
        const edgeStart = shape.vertices[i];
        const edgeEnd = shape.vertices[(i + 1) % shape.vertices.length];

        const intercept = lineIntersection(edgeStart, edgeEnd, start, end);
        if (!intercept) {
            continue;
        }

        return {
            shapeEdgeIndex: i + 1, // Insert after this vertex.
            startInside: isLeft(edgeStart, edgeEnd, start), // Whether the line start-end starts inside the polygon.
            intercept
        };
    }
}

export const subtract = (first: Vertices, second: Vertices) => {
    // Naively assume that we aren't going to cut the shape in half.
    // hopefully we can work around this (more than two intersections means we're cutting) (maybe cut with closest line to centroid?)
    const intersectionInfo: IntersectionInfo[] = [];

    // Note: This doesn't work when the intercept is exactly on the border...
    for (let i = 0; i < second.length; ++i) {
        const start = second.getVertex(i);
        const end = second.getVertex(i + 1);

        const info = getIntersectionInfo(first, start, end);
        if (!info) {
            continue;
        }

        info.removeEdgeIndex = i;
        intersectionInfo.push(info);
    }

    // If we have less than two intersections, we can't make a subtraction.
    if (intersectionInfo.length < 2) {
        return first;
    }

    // Make a copy of the vertices, so we don't change first accidentally.
    const vertices: Vector2[] = [...first.vertices];

    // Attempt to work out which intersection should go first.
    const getFirstIntersection = () => {
        // We hit this if the vertices are exactly on the intersecting edge.
        if (intersectionInfo[0].startInside === intersectionInfo[1].startInside) {
            throw new Error("You're wrong, they don't always have to start/end oppositely.")
        }

        return intersectionInfo[0].startInside ? 1 : 0;
    }

    const closestToStart = getFirstIntersection();
    const startInfo = intersectionInfo[closestToStart];
    const endInfo = intersectionInfo[1 - closestToStart];

    let insertAt = startInfo.shapeEdgeIndex % first.vertices.length;

    // Inserts a vertex.
    const addVertex = (vertex: Vector2) => {
        vertices.splice(insertAt, 0, vertex);
    }

    // Add the start intercept.
    addVertex(startInfo.intercept);

    // If the start of our edge is in the shape, we should iterate backwards to get points inside the shape.
    const step = startInfo.startInside ? -1 : 1;

    // Get the index we're starting at.
    let current = startInfo.removeEdgeIndex;

    // If the start index is outside, we should always be one ahead (e.g. the end vertex).
    const offset = startInfo.startInside ? 0 : 1;
    current = second.safeIndex(current + offset);

    do {
        // Insert start or end depending on our flag.
        addVertex(second.vertices[current]);

        // Move next.
        current = second.safeIndex(current + step);
    } while (current != second.safeIndex(endInfo.removeEdgeIndex + offset));

    // Add the end intercept.
    addVertex(endInfo.intercept);

    // TODO move this check earlier.
    // We can't make a cut if we don't add at least three vertices.
    if (vertices.length < first.length + 3) {
        return first;
    }

    return new Vertices(vertices.filter(v => !second.contains(v)));
}