import Vector2 from "../core/vector2";
import { area } from "./lineUtils";
import { Vertices } from "./vertices";

const areCollinear = (a: Vector2, b: Vector2, c: Vector2, tolerance=0): boolean => {
    const ar = area(a, b, c);
    return Math.abs(ar) < tolerance;
}

/**
 * Simplifies the vertices.
 * @param vertices The vertices to simplify.
 * @param tolerance The collinearity to tolerate.
 */
export const collinearSimplify = (vertices: Vertices, tolerance=0): Vertices => {
    if (vertices.length <= 3) return vertices;

    const simplified: Vector2[] = [];

    for (let i = 0; i < vertices.length; ++i) {
        const prev = vertices.getVertex(i - 1);
        const curr = vertices.getVertex(i);
        const next = vertices.getVertex(i + 1);

        if (areCollinear(prev, next, curr, tolerance)) continue;

        simplified.push(curr);
    }

    return new Vertices(simplified);
}

export const distSimplify = (vertices: Vertices, minDistance=0) => {
    if (vertices.length <= 3) return vertices;

    const result = [...vertices.vertices];

    for (let i = 0; i < vertices.length; ++i) {

    }

    let i = 0;
    while (result.length > 3 && i < result.length) {
        const curr = result[i];
        const next = result[(i + 1) % result.length];

        const distance = curr.distance(next);
        if (distance < minDistance) {
            result.splice(i, 1);
        } else ++i;
    }

    return new Vertices(result);
}