import Vector2 from "../core/vector2";
import { area, isLeft, isLeftOn, isRight, isRightOn, lineIntersection } from "./lineUtils";
import { Vertices } from "./vertices";

const inv = <T>(func: (...args: Vector2[]) => T, vertices: Vertices, ...indices: (number | Vector2)[]) =>
    func(...indices.map(i => typeof i === 'number' ? vertices.getVertex(i) : i));

/**
 * Special line intersection algorithm for the decomposer.
 */
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
export const convexPartition = (vertices: Vertices, result?: Vertices[]): Vertices[] => {
    const invoke = <T>(func: (...args: Vector2[]) => T, ...indices: (number | Vector2)[]) =>
        inv(func, vertices, ...indices);

    if (!result) {
        result = [];
    }

    let lowerIntercept = new Vector2();
    let upperIntercept = new Vector2(); // intersection points
    let lowerIndex = 0;
    let upperIndex = 0;
    let lowerPoly: Vertices;
    let upperPoly: Vertices;

    for (let i = 0; i < vertices.length; ++i) {
        let c = invoke(area, i - 1, i, i + 1);
        if (vertices.isReflexAt(i)) {
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
                    if (invoke(isRight, i + 1, i, point)) {
                        // Find the distance to the intercept.
                        distance = point.distanceSquared(vertices.getVertex(i));
                        if (distance < lowerDistance) {
                            // Only keep the closest intersection.
                            lowerDistance = distance;
                            lowerIntercept = point;
                            lowerIndex = j;
                        }
                    }
                }

                if (invoke(isLeft, i + 1, i, j + 1) && invoke(isRightOn, i + 1, i, j)) {
                    point = invoke(lineIntersect, i + 1, i, j, j + 1);
                    if (invoke(isLeft, i - 1, i, point)) {
                        distance = point.distanceSquared(vertices.getVertex(i));
                        if (distance < upperDistance) {
                            upperDistance = distance;
                            upperIntercept = point;
                            upperIndex = j;
                        }
                    }
                }
            }

            // If there are no vertices to connect to, choose a point in the middle.
            if (lowerIndex === vertices.safeIndex(upperIndex + 1)) {
                const point = lowerIntercept.add(upperIntercept).mul(0.5);

                lowerPoly = vertices.slice(i, upperIndex + 1);
                lowerPoly.vertices.push(point);

                upperPoly = vertices.slice(lowerIndex, i + 1);
                upperPoly.vertices.push(point);
            }
            else {
                let highestScore = 0,
                    bestIndex = lowerIndex;

                while (upperIndex < lowerIndex)
                    upperIndex += vertices.length;

                for (let j = lowerIndex; j <= upperIndex; ++j) {
                    if (!canSee(i, j, vertices)) continue;

                    let score = 1 / (vertices.getVertex(i).distanceSquared(vertices.getVertex(j)) + 1);
                    if (vertices.isReflexAt(j)) {
                        if (invoke(isRightOn, j - 1, j, i) && invoke(isLeftOn, j + 1, j, i))
                            score += 3
                        else score += 2;
                    }
                    else {
                        score += 1;
                    }

                    if (score > highestScore) {
                        bestIndex = j;
                        highestScore = score;
                    }
                }
                lowerPoly = vertices.slice(i, Math.round(bestIndex) + 1);
                upperPoly = vertices.slice(Math.round(bestIndex), i + 1);
            }

            convexPartition(lowerPoly, result);
            convexPartition(upperPoly, result);
            return result;
        }
    }

    // If we reach here, the polygon is already convex, so return it.
    result.push(vertices);
    return result;
}