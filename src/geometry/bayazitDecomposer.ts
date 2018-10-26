import { Vertices } from "./vertices";
import Vector2 from "../core/vector2";
import { isLeft, isRightOn, isRight, isLeftOn, lineIntersection } from "./lineUtils";

const inv = <T>(func: (...args: Vector2[]) => T, vertices: Vertices, ...indices: (number | Vector2)[]) =>
    func(...indices.map(i => typeof i === 'number' ? vertices.getVertex(i) : i));

const copy = (i: number, j: number, vertices: Vertices) => {
    while (j < i) j += vertices.length;

    const result = [];
    for (; i <= j; i++)
        result.push(vertices.vertices[i % vertices.vertices.length]);

    return new Vertices(result, true);
}

const lineIntersect = (p1: Vector2, p2: Vector2, q1: Vector2, q2: Vector2) => {
    let a1 = p2.y - p1.y;
    let b1 = p1.x - p2.x;
    let c1 = a1 * p1.x + b1 * p1.y;
    let a2 = q2.y - q1.y;
    let b2 = q1.x - q2.x;
    let c2 = a2 * q1.x + b2 * q1.y;
    let det = a1 * b2 - a2 * b1;

    if (Math.abs(det) > 0.00005) {
        // lines are not parallel
        return new Vector2((b2 * c1 - b1 * c2) / det,
            (a1 * c2 - a2 * c1) / det);
    }
    return Vector2.zero;
}

function canSee(i: number, j: number, vertices: Vertices) {
    console.log(`CanSee: ${i}-${j}?`);
    if (vertices.isReflexAt(i)) {
        if (inv(isLeftOn, vertices, i, i - 1, j) && inv(isRightOn, vertices, i, i + 1, j))
            return false;
    }
    else {
        if (inv(isRightOn, vertices, i, i + 1, j) || inv(isLeftOn, vertices, i, i - 1, j))
            return false;
    }

    if (vertices.isReflexAt(j)) {
        if (inv(isLeftOn, vertices, j, j - 1, i) && inv(isRightOn, vertices, j, j + 1, i))
            return false;
    }
    else {
        if (inv(isRightOn, vertices, j, j + 1, i) || inv(isLeftOn, vertices, j, j - 1, i))
            return false;
    }

    for (let k = 0; k < vertices.length; ++k) {
        if (vertices.safeIndex(k + 1) == i || k == i || vertices.safeIndex(k + 1) == j || k == j)
            continue; // Ignore incident edges.
        const intersectionPoint = inv(lineIntersection, vertices, i, j, k, k + 1)
        if (intersectionPoint) {
            console.log(`Line Intersection: ${intersectionPoint.x} ${intersectionPoint.y}`);
            return false;
        }
    }

    return true;
}

/**
 * Convex decomposition algorithm created by Mark Bayazit
 * based on: https://github.com/VelcroPhysics/VelcroPhysics/blob/master/VelcroPhysics/Tools/Triangulation/Bayazit/BayazitDecomposer.cs
 * @param vertices The vertices to decompose.
 */
export const convexPartition = (vertices: Vertices): Vertices[] => {
    console.log("==Entered==");

    const invoke = <T>(func: (...args: Vector2[]) => T, ...indices: (number | Vector2)[]) =>
        inv(func, vertices, ...indices);

    const result: Vertices[] = [];

    let lowerIntercept = new Vector2();
    let upperIntercept = new Vector2(); // intersection points
    let lowerIndex = 0;
    let upperIndex = 0;
    let lowerPoly: Vertices;
    let upperPoly: Vertices;

    for (let i = 0; i < vertices.length; ++i) {
        if (vertices.isReflexAt(i)) {
            console.log(`Reflex at ${i}`)
            let upperDistance: number,
                lowerDistance: number;
            lowerDistance = upperDistance = Number.MAX_SAFE_INTEGER;

            for (let j = 0; j < vertices.length; ++j) {
                // If the line intersects with an edge.
                let distance: number;
                let point: Vector2;
                if (invoke(isLeft, i - 1, i, j) && invoke(isRightOn, i - 1, i, j - 1)) {
                    // Find the point of intersection.
                    point = invoke(lineIntersect, i - 1, i, j, j - 1);
                    console.log(`Lower Intersection point ${point.x} ${point.y} (i: ${i}, j: ${j}`);
                    if (invoke(isRight, i + 1, i, point)) {
                        // Find the distance to the intercept.
                        distance = point.distanceSquared(vertices.getVertex(i));
                        console.log(`Lower Distance: ${distance}`);
                        if (distance < lowerDistance) {
                            console.log(`New lowest: @${j} (dist is ${distance})`);

                            // Only keep the closest intersection.
                            lowerDistance = distance;
                            lowerIntercept = point;
                            lowerIndex = j;
                        }
                    }
                }

                if (invoke(isLeft, i + 1, i, j + 1) && invoke(isRightOn, i + 1, i, j)) {
                    point = invoke(lineIntersect, i + 1, i, j, j + 1);
                    console.log(`Higher Intersection point ${point.x} ${point.y} (i: ${i}, j: ${j}`);
                    if (invoke(isLeft, i - 1, i, point)) {
                        distance = point.distanceSquared(vertices.getVertex(i));
                        console.log(`Higher Distance: ${distance}`);
                        if (distance < upperDistance) {
                            console.log(`New highest: @${j} (dist is ${distance})`);
                            upperDistance = distance;
                            upperIntercept = point;
                            upperIndex = j;
                        }
                    }
                }
            }

            // If there are no vertices to connect to, choose a point in the middle.
            if (lowerIndex === vertices.safeIndex(upperIndex + 1)) {
                console.log(`No vertices to connect to (lowerIndex: ${lowerIndex}, upperIndex: ${upperIndex})`);
                const point = lowerIntercept.add(upperIntercept).mul(0.5);

                lowerPoly = copy(i, upperIndex, vertices);
                lowerPoly.vertices.push(point);

                upperPoly = copy(lowerIndex, i, vertices);
                upperPoly.vertices.push(point);
            }
            else {
                console.log('Calculating best');
                let highestScore = 0,
                    bestIndex = lowerIndex;

                while (upperIndex < lowerIndex)
                    upperIndex += vertices.length;

                for (let j = lowerIndex; j <= upperIndex; ++j) {
                    if (!canSee(i, j, vertices)) continue;
                    console.log(`Can see ${i} - ${j}`);

                    let score = 1 / (vertices.getVertex(i).distanceSquared(vertices.getVertex(j)) + 1);
                    if (vertices.isReflexAt(j)) {                                   
                        console.log(`Reflex at ${j}`);

                        if (invoke(isRightOn, j - 1, j, i) && invoke(isLeftOn, j + 1, j, i))
                            score += 3
                        else score += 2;
                    }
                    else {
                        score += 1;
                    }

                    console.log(`Score: ${score}`);

                    if (score > highestScore) {
                        console.log("New best score!");
                        bestIndex = j;
                        highestScore = score;
                    }
                }
                console.log(`Found best: ${Math.round(bestIndex)}. i: ${i}`);
                lowerPoly = copy(i, Math.round(bestIndex), vertices);
                upperPoly = copy(Math.round(bestIndex), i, vertices);
            }

            console.log(`Generating polygons with ${lowerPoly.length} and ${upperPoly.length} vertices`);

            // TODO convert to tail recursion.
            result.push(...convexPartition(lowerPoly));
            result.push(...convexPartition(upperPoly));
            return result;
        }
    }

    // If we reach here, the polygon is already convex, so return it.
    console.log("Not convex, returning unchanged");
    result.push(vertices);
    return result;
}