import { epsilon } from "../collision/collisionSettings";
import { AABB } from "../core/aabb";
import Vector2 from "../core/vector2";
import { isLeft, isRight } from "./lineUtils";

export class Vertices {
    vertices: Vector2[];
    private internalBounds: AABB;
    private internalCentroid: Vector2;
    private internalNormals: Vector2[];
    private internalArea: number;

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

    get centroid() {
        return this.internalCentroid || (this.internalCentroid = this.average())
    }

    get normals() {
        if (this.internalNormals) {
            return this.internalNormals;
        }

        this.internalNormals = [];
        for (let i = 0; i < this.length; ++i) {
            const current = this.getVertex(i);
            const next = this.getVertex(i + 1);

            const normal = new Vector2(
                (next.y - current.y),
                -(next.x - current.x)
            ).normalized();
            
            this.internalNormals.push(normal);
        }

        return this.internalNormals;
    }

    get area() {
        if (this.internalArea) return this.internalArea;

        this.internalArea = 0;
        for (let i = 0; i < this.length; ++i) {
            const p = this.getVertex(i);
            const q = this.getVertex(i + 1);

            this.internalArea += (p.x * q.y) - (p.y * q.x);
        }

        this.internalArea *= 0.5;
        return this.internalArea;
    }

    get length() {
        return this.vertices.length;
    }

    constructor(vertices: Vector2[], suppressWarnings?: boolean) {
        if (!vertices) {
            throw new Error("Vertices must be defined");
        }

        // if (vertices.length < 3 && !suppressWarnings) {
        //     throw new Error("You must provide at least 3 vertices");
        // }

        this.vertices = vertices;
        this.forceCounterClockwise();
        this.internalArea = undefined;
    }

    isCounterClockwise() {
        return this.area > 0;
    }

    forceCounterClockwise() {
        if (this.isCounterClockwise()) 
            return;

        this.vertices = this.vertices.reverse();
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
        from = this.safeIndex(from);
        to = this.safeIndex(to);
        
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

    /**
     * Gets the point(s) furtherest in a direction in the polygon.
     * @param direction The direction.
     */
    getSupports(direction: Vector2) {
        let supports: Vector2[] = [];
        let best: number;

        for (const vec of this.vertices) {
            const projection = vec.dot(direction);

            if (Math.abs(projection - best) < epsilon) {
                supports.push(vec);
            }
            else if (projection > best || !best) {
                supports = [vec];
                best = projection;
            }
        }

        return supports;
    }
}