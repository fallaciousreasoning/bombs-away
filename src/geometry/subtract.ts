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
            index: i+1, // Insert after this vertex.
            startInside: isLeft(edgeStart, edgeEnd, start), // Whether the line start-end starts inside the polygon.
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

    // const result = [...first.vertices];
    // const insert: Vector2[] = [];
    // let insertAt = -1;

    // for (let i = 0; i < second.vertices.length; ++i) {
    //     const start = second.vertices[i];
    //     const end = second.vertices[(i + 1) % second.vertices.length];

    //     const intersection = intersectionIndex(first, start, end);
    //     if (intersection) {
    //         insert.push(intersection.intersection);

    //         if (insertAt !== -1) {
    //             break;
    //         }

    //         insertAt = intersection.index;
    //     }

    //     if (insertAt === -1) {
    //         continue;
    //     }

    //     insert.push(end);
    // }

    // // We reverse the inserted vertices, because we go around the wrong way..
    // result.splice(insertAt, 0, ...insert.reverse());

    const intersections: ReturnType<typeof intersectionIndex>[] = [];
    const vertexIndices: number[] = [];
    
    let current = 0;
    while (intersections.length < 2 && current < second.vertices.length) {
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
        if (intersections[0].startInside === intersections[1].startInside) {
            throw new Error("You're wrong, they don't always have to start/end oppositely.")
        }

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