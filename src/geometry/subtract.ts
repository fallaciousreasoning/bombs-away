import { Vertices } from "./vertices";
import Vector2 from "../core/vector2";
import { shortestDistanceToLine, lineIntersection, isLeft } from "./utils";

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
            index: i+1, // Insert after this vertex.
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
    
    let current = 0;
    while (current < second.vertices.length) {
        const start = second.vertices[current];
        const end = second.vertices[(current + 1)%second.vertices.length];
        
        current++;

        const intersection = intersectionIndex(first, start, end);
        if (!intersection) {
            continue;
        }

        intersections.push(intersection);
        vertexIndices.push(current);
    }

    if (intersections.length < 2) {
        return first;
    }

    const vertices: Vector2[] = [...first.vertices];

    // Attempt to work out which intersection should go first.
    // TODO: Pretty sure theres a bug here when the two intersections
    // are not on the same edge (e.g. we have a point inside our shape)
    const getClosestIntersection = () => {
        // TODO: The assertion is wrong, need something to fallback on?
        // if (intersections[0].startInside === intersections[1].startInside) {
        //     throw new Error("You're wrong, they don't always have to start/end oppositely.")
        // }

        return intersections[0].startInside ? 1 : 0;
    }

    const closestToStart = getClosestIntersection();
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

    // Loops an index inside second.vertices.
    const looped = (index: number) => {
        if (index < 0) index = second.vertices.length - 1;
        if (index >= second.vertices.length) index = 0;
        return index;
    }

    // Get the index we're starting at.
    current = startVertexNumber;
    // If the start index is inside, we should always be one ahead (e.g. the end vertex).
    const offset = !startIntersection.startInside ? 0 : 1;
    current = looped(current + offset);

    do {
        // Insert start or end depending on our flag.
        addVertex(second.vertices[current]);

        // Step
        current = looped(current + step);
    } while (current != looped(endVertexNumber + offset));

    // Add the end intersection point.
    addVertex(endIntersection.intersection);

    // TODO remove points in first that are inside second.

    return new Vertices(vertices.filter(v => !second.contains(v)));
}