import Vector2 from "../core/vector2";
import { AABB } from "../core/aabb";

/**
 * Determine whether the point 'point' is to the left of the line from start to end.
 * @param start The start point of the line.
 * @param end The end point of the line.
 * @param point The point to determine the 'leftness' of.
 */
const isLeft = (start: Vector2, end: Vector2, point: Vector2) => {
    return (end.x - start.x) * (point.y - start.y) - (end.y - start.y) * (point.x - start.x) <= 0;
}

export class Vertices {
    vertices: Vector2[];
    private internalBounds: AABB;

    get bounds() {
        if (this.internalBounds) {
            return this.internalBounds;
        }

        let minX,
            minY,
            maxX,
            maxY;

        this.internalBounds = new AABB(new Vector2(), new Vector2());
        throw new Error("Not yet implemented!");
    }

    private internalCentroid: Vector2;

    get centroid() {
        return this.internalCentroid || (this.internalCentroid = this.average())
    }

    constructor(vertices: Vector2[]) {
        this.vertices = vertices;
    }

    contains(point: Vector2) {
        for (let i = 0; i < this.vertices.length; ++i) {
            const next = i === this.vertices.length - 1 ? 0 : i + 1;
            const left = isLeft(this.vertices[i], this.vertices[next], point);
            if (!left) return false;
        }

        return  true;
    }

    subtract(remove: Vertices) {
        if (!remove.bounds.intersects(this.bounds)) {
            return;
        }

        // TODO assert that at least one point is outside this one.
    }

    translate(by: Vector2) {
        return new Vertices(this.vertices.map(v => v.add(by)));
    }

    rotate(angle: number) {
        return new Vertices(this.vertices.map(v => v.rotate(angle)));
    }

    scale(scale: number | Vector2) {
        return new Vertices(this.vertices.map(v => v.mul(scale)));
    }

    average() {
        return this.vertices.reduce((prev, next) => prev.add(next), Vector2.zero).div(this.vertices.length);
    }
}