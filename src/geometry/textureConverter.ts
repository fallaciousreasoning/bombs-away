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
    points: number[][];
    vertices: Vertices[];

    constructor(points: number[][]) {
        this.points = points;
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
        return this.vertices.some(polygon => polygon.contains(vertex)
            || polygon.hasVertex(vertex));
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

    makeHull(startVertex: Vector2): Vertices {
        const polygon: Vector2[] = [];

        // Keep finding the next vertex until we get back where we started.
        do {
            var { vertex, direction } = this.findNextVertex(vertex
                || startVertex,
                direction === undefined
                    ? 3
                    : direction);

            polygon.push(vertex);
        } while (!vertex.equals(startVertex));

        const result = new Vertices(polygon);
        result.forceCounterClockwise();

        // TODO: Snip on duplicates.
        // If alreadySeen(vertex) <-- move everything before the previous occurence to its own polygon.
        // Carry on building this one.
        return result;
    }

    getVertices(): Vertices[] {
        if (this.vertices) return this.vertices;

        this.vertices = [];

        for (let y = 0; y < this.points.length; ++y)
            for (let x = 0; x < this.points[y].length; ++x) {
                const vertex = new Vector2(x, y);

                if (!this.isSolid(vertex)) continue;
                if (this.isInShape(vertex)) continue;

                // Bug is that contains alg is bad.
                const polygon = this.makeHull(vertex);
                const simplified = collinearSimplify(polygon, 0);

                this.vertices.push(simplified);
            }

        return this.vertices;
    }
}