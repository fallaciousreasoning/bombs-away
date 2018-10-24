import Vector2 from "../core/vector2";
import { AABB } from "../core/aabb";

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

    constructor(vertices: Vector2[]) {
        this.vertices = vertices;
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