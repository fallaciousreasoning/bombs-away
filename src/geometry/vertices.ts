import Vector2 from "../core/vector2";
import { AABB } from "../core/aabb";
import { isLeft, isRight } from "./lineUtils";

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

    get length() {
        return this.vertices.length;
    }

    constructor(vertices: Vector2[], suppressWarnings?: boolean) {
        if (!vertices) {
            throw new Error("Vertices must be defined");
        }

        if (vertices.length < 3 && !suppressWarnings) {
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

        return true;
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

    /**
     * Reduces the resolution of the vertices.
     * @param resolution The minimum distance between to vertices for them to matter.
     */
    atResolution(resolution: number) {
        const vertices = [this.vertices[0]];

        const distanceSquared = resolution * resolution;
        for (let i = 1; i < this.vertices.length; ++i) {
            const last = vertices[vertices.length - 1];
            const curr = this.vertices[i];

            if (curr.distanceSquared(last) < distanceSquared) {
                continue;
            }

            vertices.push(curr);
        }

        return new Vertices(vertices);
    }

    /**
     * Loops the index around the length of the array.
     * @param index The index.
     */
    safeIndex(index: number) {
        index %= this.vertices.length;
        if (index < 0) {
            index += this.vertices.length;
        }

        return index;
    }

    /**
     * Gets the vertex at the index (loops around the ends of the array).
     * @param index The index of the vertex.
     */
    getVertex(index: number) {
        return this.vertices[this.safeIndex(index)];
    }

    /**
     * Takes a continuous, looping slice of the vertices.
     * @param from The index to start at.
     * @param to The index to end at.
     */
    slice(from: number, to: number) {
        const vertices = [];

        while (from != to) {
            vertices.push(this.getVertex(from));
            from = this.safeIndex(from + 1);
        }

        return new Vertices(vertices, true);
    }

    isReflexAt(index: number) {
        return isRight(this.getVertex(index - 1), this.getVertex(index), this.getVertex(index + 1));
    }
}