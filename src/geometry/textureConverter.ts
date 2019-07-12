import { Vertices } from "./vertices";
import Vector2 from "../core/vector2";
import { collinearSimplify } from "./simplifyTools";

const directions = [
    // Up: 0
    new Vector2(0, -1),

    // Up, Right: 1*Math.PI/4
    new Vector2(1, -1),

    // Right: 2*Math.PI/4
    new Vector2(1, 0),

    // Down, Right: 3*Math.PI/4
    new Vector2(1, 1),

    // Down: 4*Math.PI/4
    new Vector2(0, 1),

    // Down, Left: 5*Math.PI/4
    new Vector2(-1, 1),

    // Left: 6*Math.PI/4
    new Vector2(-1, 0),

    // Up, Left: 7*Math.PI/4
    new Vector2(-1, -1),
];

export class TextureConverter {
    epsilon = 1e-6;
    points: number[][] = [];
    vertices: Vertices[];

    constructor(points: (0 | 1)[][]) {
        // Make a copy.
        for (const row of points)
            this.points.push([...row]);
    }

    /**
     * Determines whether the vertex is a valid point on the shape.
     * @param vertex The vertex
     */
    inBounds(vertex: Vector2) {
        return vertex.x >= 0 && vertex.y >= 0 && vertex.y < this.points.length && vertex.x < this.points[0].length;
    }

    /**
     * Determines whether the vertex has already been consumed.
     * @param vertex The vertex to check.
     */
    isInShape(vertex: Vector2) {
        // TODO: Make sure polygon is checking its bounds have the point.
        return this.points[vertex.y][vertex.x] > 1;
    }

    /**
     * Determines whether a vetex is solid.
     * @param vertex The vertex to determine solidity of.
     */
    isSolid(vertex: Vector2) {
        return !!this.points[vertex.y][vertex.x];
    }

    /**
     * 
     * @param currentVertex The vertex to start from.
     * @param currentDirection The current direction (in directions).
     */
    findNextVertex(currentVertex: Vector2, currentDirection: number) {
        // Loop through all directions but one.
        for (let i = 0; i < directions.length - 1; ++i) {
            // Starting direction is one clockwise rotation from our current, because we might have missed it.
            let direction = currentDirection + 2 - i;

            if (direction < 0) direction += directions.length;
            direction %= directions.length;

            const vertex = currentVertex.add(directions[direction]);
            if (!this.inBounds(vertex)) continue;

            if (this.isSolid(vertex)) return { direction, vertex };
        }

        throw new Error("Looks like we had a line of vertices (this is not handled :/)");
    }

    addPolygon(vertices: Vertices) {
        vertices.forceCounterClockwise();

        const simplified = collinearSimplify(vertices, 0);
        this.vertices.push(simplified);
    }

    unwindPolygonTo(vertices: Vector2[], to: Vector2) {
        for (let i = vertices.length - 1; i >= 0; --i) {
            const vertex = vertices[i];
            if (!vertex.equals(to)) continue;

            const newVertices = vertices.splice(i + 1);
            // Make sure the first corner is included.
            newVertices.push(to);

            // We hit this on the other corner.
            if (newVertices.length >= 3)
                this.addPolygon(new Vertices(newVertices));
            return;
        }

        throw new Error("Failed to create unwound polygon!");
    }

    labelRegion(startVertex: Vector2) {
        const seen: Set<number> = new Set();
        const stack: Vector2[] = [];

        stack.push(startVertex);
        seen.add(startVertex.hashCode());

        while (stack.length) {
            const current = stack.pop();
            if (!this.inBounds(current)) continue;

            this.points[current.y][current.x] = this.vertices.length + 2; // 1 for solidity, one to mark as consumed.

            const newVertices = directions.map(v => current.add(v)).filter(v => this.inBounds(v) && this.isSolid(v) && !seen.has(v.hashCode()));
            newVertices.forEach(v => seen.add(v.hashCode()));
            stack.push(...newVertices);
        }
    }

    extractHullsFrom(startVertex: Vector2) {
        const polygon: Vector2[] = [];
        const seenVertices = new Set();

        // Keep finding the next vertex until we get back where we started.
        do {
            var { vertex, direction } = this.findNextVertex(vertex
                || startVertex,
                direction === undefined
                    ? 3
                    : direction);
            const hash = `${vertex.x}_${vertex.y}`;

            if (seenVertices.has(hash)) {
                // Move this vertex and all vertices until the previous occurrence into a new polygon.
                this.unwindPolygonTo(polygon, vertex);
                continue;
            }

            polygon.push(vertex);
            seenVertices.add(hash);
        } while (!vertex.equals(startVertex));

        this.addPolygon(new Vertices(polygon));
    }

    getVertices(): Vertices[] {
        if (this.vertices) return this.vertices;

        this.vertices = [];

        for (let y = 0; y < this.points.length; ++y)
            for (let x = 0; x < this.points[y].length; ++x) {
                const vertex = new Vector2(x, y);

                if (!this.isSolid(vertex)) continue;
                if (this.isInShape(vertex)) continue;

                this.extractHullsFrom(vertex);
                // Mark this region as solved.
                this.labelRegion(vertex);
            }

        return this.vertices;
    }
}