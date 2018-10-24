import Vector2 from "../core/vector2";
import { AABB } from "../core/aabb";
import { isLeft } from "./utils";

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

        for (const vertex of this.vertices) {
            minX = minX ? Math.min(minX, vertex.x) : vertex.x;
            maxX = maxX ? Math.max(maxX, vertex.x) : vertex.x;
            minY = minY ? Math.min(minY, vertex.y) : vertex.y;
            maxY = maxY ? Math.max(minY, vertex.y) : vertex.y;
        }

        const halfSize = new Vector2(maxX, maxY).sub(new Vector2(minX, minY)).div(2);
        this.internalBounds = new AABB(new Vector2(), halfSize);
        return this.internalBounds;
    }

    private internalCentroid: Vector2;

    get centroid() {
        return this.internalCentroid || (this.internalCentroid = this.average())
    }

    constructor(vertices: Vector2[]) {
        if (!vertices) {
            throw new Error("Vertices must be defined");
        }

        if (vertices.length < 3) {
            throw new Error("You must provide at least 3 vertices");
        }

        this.vertices = vertices;
    }

    contains = (point: Vector2) => {
        for (let i = 0; i < this.vertices.length; ++i) {
            const next = i === this.vertices.length - 1 ? 0 : i + 1;
            const left = isLeft(this.vertices[i], this.vertices[next], point);
            if (!left) return false;
        }

        return  true;
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

    shift(by: number) {
        const vertices = [];
        for (const vertex of this.vertices) {
            vertices[(by++)%this.vertices.length] = vertex;
        }

        return new Vertices(vertices);
    }
}