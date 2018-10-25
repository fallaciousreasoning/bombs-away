import { Vertices } from "./vertices";
import Vector2 from "../core/vector2";
import { shortestDistanceToLine, lineIntersection, isLeft } from "./utils";

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
        const edgeEnd = shape.vertices[(i + 1) % shape.vertices.length];

        const intersection = lineIntersection(edgeStart, edgeEnd, start, end);
        if (!intersection) {
            continue;
        }

        return {
            index: i + 1, // Insert after this vertex.
            startInside: isLeft(edgeStart, edgeEnd, start), // Whether the line start-end starts inside the polygon.
            intersection
        };
    }
}

export const subtract = (first: Vertices, second: Vertices) => {
    // Naively assume that we aren't going to cut the shape in half.
    // hopefully we can work around this (more than two intersections means we're cutting) (maybe cut with closest line to centroid?)
    const intersections: ReturnType<typeof intersectionIndex>[] = [];
    const vertexIndices: number[] = [];

    for (let i = 0; i < second.length; ++i) {
        const start = second.getVertex(i);
        const end = second.getVertex(i + 1);

        const intersection = intersectionIndex(first, start, end);
        const hash = intersection && intersection.intersection.hashCode();
        if (!intersection) {
            continue;
        }

        intersections.push(intersection);
        vertexIndices.push(i);
    }

    // If we have less than two intersections, we can't make a subtraction.
    if (intersections.length < 2) {
        return first;
    }

    // TODO: Ensure there is at least one point in between them, otherwise return first.

    // Make a copy of the vertices, so we don't change first accidentally.
    const vertices: Vector2[] = [...first.vertices];

    // Attempt to work out which intersection should go first.
    const getFirstIntersection = () => {
        // TODO: The assertion is wrong, need something to fallback on?
        if (intersections[0].startInside === intersections[1].startInside) {
            console.log(intersections)
            throw new Error("You're wrong, they don't always have to start/end oppositely.")
        }

        return intersections[0].startInside ? 1 : 0;
    }

    const closestToStart = getFirstIntersection();
    const startIntersection = intersections[closestToStart];
    const startVertexNumber = vertexIndices[closestToStart];
    const endIntersection = intersections[1 - closestToStart];
    const endVertexNumber = vertexIndices[1 - closestToStart];

    let insertAt = startIntersection.index % first.vertices.length;

    // Inserts a vertex.
    const addVertex = (vertex: Vector2) => {
        vertices.splice(insertAt, 0, vertex);
    }

    // Add the start intersection point.
    addVertex(startIntersection.intersection);

    // If the start of our edge is in the shape, we should iterate backwards to get points inside the shape.
    const step = startIntersection.startInside ? -1 : 1;

    // Get the index we're starting at.
    let current = startVertexNumber;

    // If the start index is outside, we should always be one ahead (e.g. the end vertex).
    const offset = startIntersection.startInside ? 0 : 1;
    current = second.safeIndex(current + offset);

    do {
        // Insert start or end depending on our flag.
        addVertex(second.vertices[current]);

        // Move next.
        current = second.safeIndex(current + step);
    } while (current != second.safeIndex(endVertexNumber + offset));

    // Add the end intersection point.
    addVertex(endIntersection.intersection);

    return new Vertices(vertices.filter(v => !second.contains(v)));
}