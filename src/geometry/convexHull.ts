import { Vertices } from "./vertices";
import Vector2 from "../core/vector2";

/**
 * Determine whether the point 'point' is to the left of the line from start to end.
 * @param start The start point of the line.
 * @param end The end point of the line.
 * @param point The point to determine the 'leftness' of.
 */
const isLeft = (start: Vector2, end: Vector2, point: Vector2) => {
    return (end.x - start.x) * (point.y - start.y) - (end.y - start.y) * (point.x - start.x) <= 0;
}

/**
 * A counterclockwise list of vertices defining the
 * edge of a convex hull.
 */
export class ConvexHull extends Vertices {
    private internalCentroid: Vector2;

    get centroid() {
        return this.internalCentroid || (this.internalCentroid = this.average())
    }

    contains(point: Vector2) {
        for (let i = 0; i < this.vertices.length; ++i) {
            const next = i === this.vertices.length - 1 ? 0 : i + 1;
            const left = isLeft(this.vertices[i], this.vertices[next], point);
            if (!left) return false;
        }

        return  true;
    }

    subtract(remove: ConvexHull) {
        if (!remove.bounds.intersects(this.bounds)) {
            return;
        }

        // TODO assert that at least one point is outside this one.
    }
}