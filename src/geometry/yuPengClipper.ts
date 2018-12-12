import Vector2 from "../core/vector2";
import { area, lineIntersection } from "./lineUtils";
import { collinearSimplify } from "./simplifyTools";
import { Vertices } from "./vertices";

const clipperEpsilonSquared = 1.192092896e-07;

/**
 * Calculates the intersections and adds them to the polygons.
 * This basically returns the polygons with intersection points as vertices.
 * @param subject The subject polygon
 * @param clip The clip polygon
 */
const calculateIntersections = (polygon1: Vertices, polygon2: Vertices): { subject: Vertices, clip: Vertices } => {
    const slicedPolygon1 = new Vertices(polygon1.vertices);
    const slicedPolygon2 = new Vertices(polygon2.vertices);

    /**
     * Used for determining the ordering of multiple intersections on the same edge.
     * @param start The start point
     * @param end The end point
     * @param point The point
     */
    const getAlpha = (start: Vector2, end: Vector2, point: Vector2) => {
        return point.sub(start).lengthSquared() / end.sub(start).lengthSquared();
    }

    const insertIntersection = (into: Vertices, intersection: Vector2, a: Vector2, b: Vector2) => {
        const alpha = getAlpha(a, b, intersection);
        if (alpha > 0 && alpha < 1) {
            let index = into.vertices.indexOf(a) + 1;
            while (index < into.length
                && getAlpha(a, b, into.vertices[index]) <= alpha) {
                    ++index;
                }
            into.vertices.splice(index, 0, intersection);
        }
    }

    const removeSmallEdges = (from: Vertices) => {
        for (let i = 0; i < from.length; ++i) {
            const a = from.getVertex(i);
            const b = from.getVertex(i + 1);

            if (b.sub(a).lengthSquared() <= clipperEpsilonSquared)
                from.vertices.splice(i--, 1);
        }
    }

    for (let i = 0; i < polygon1.length; ++i) {
        // Edge in polygon 1
        const a = polygon1.getVertex(i);
        const b = polygon1.getVertex(i + 1);

        // Check for an intersection with any edge in polygon 2
        for (let j = 0; j < polygon2.length; ++j) {
            // Edge in polygon 2
            const c = polygon2.getVertex(j);
            const d = polygon2.getVertex(j + 1);

            const intersectionPoint = lineIntersection(a, b, c, d);

            // If the edges don't intersect, continue.
            if (!intersectionPoint) {
                continue;
            }

            insertIntersection(slicedPolygon1, intersectionPoint, a, b);
            insertIntersection(slicedPolygon2, intersectionPoint, c, d);
        }
    }

    removeSmallEdges(slicedPolygon1);
    removeSmallEdges(slicedPolygon2);

    return { subject: slicedPolygon1, clip: slicedPolygon2 };
}

export const difference = (subject: Vertices, clip: Vertices) => {
    // Calculate the intersection and touch points
    const sliced = calculateIntersections(subject, clip);

    const lsBound = sliced.subject.bounds.min;
    const lcBound = sliced.subject.bounds.min;
    const translate = Vector2.one.sub(Vector2.min(lsBound, lcBound));

    // Translate polygons into the upper right quadrant, as the algorithm depends on it.
    if (translate.lengthSquared() != 0) {
        sliced.subject = sliced.subject.translate(translate);
        sliced.clip = sliced.clip.translate(translate);
    }

    // TODO force counter clockwise.

    const subjectPairs = calculateSimplicalChain(sliced.subject);
    const clipPairs = calculateSimplicalChain(sliced.clip);

    const resultSimplices = calculateResultChain(subjectPairs, clipPairs);

    const invTranslate = translate.negate();
    const result = buildPolygonsFromChain(resultSimplices)
        .map(poly => collinearSimplify(poly)) // Simplify
        .map(poly => poly.translate(invTranslate)); // Translate back
    return result;
}

/**
 * Calculates the simplical chain corresponding to the input polygon.
 * @param poly The input polygon.
 */
const calculateSimplicalChain = (poly: Vertices): CoeffEdge[] => poly
    .vertices
    .map((start, i) => ({
        edge: new Edge(start, poly.getVertex(i + 1)),
        coeff: calculateSimplexCoefficient(Vector2.zero, start, poly.getVertex(i + 1))
    }));

/**
 * Returns the coefficient of a simplex.
 * @returns 0 if the points are collinear, -1 if they wind left or 1 if right.
 */
const calculateSimplexCoefficient = (a: Vector2, b: Vector2, c: Vector2) => {
    const leftness = area(a, b, c);
    if (leftness < 0) return -1;
    if (leftness > 0) return 1;

    return 0;
}

/**
 * Calculates the characteristics function for all edges of
 * the given simplical chains and builds the result chain.
 * @param subjectInfo The subject info
 * @param clipInfo The clip info
 */
const calculateResultChain = (subjectInfo: CoeffEdge[], clipInfo: CoeffEdge[]) => {
    const resultSimplices: Edge[] = [];
    const contains = (list: (CoeffEdge | Edge)[], simplex: Edge | CoeffEdge) => {
        const edge = 'edge' in simplex ? simplex.edge : simplex;
        return list.find(i => {
            const ie = 'edge' in i ? i.edge : i;
            return ie.equals(edge);
        });
    }

    /**
     * Used for calculating the characteristics function of a simplex.
     */
    const calculateBeta = (point: Vector2, info: CoeffEdge) => {
        let result = 0;
        if (pointInSimplex(point, info.edge)) {
            result = info.coeff;
        }

        if (pointOnLineSegment(Vector2.zero, info.edge.edgeStart, point)
            || pointOnLineSegment(Vector2.zero, info.edge.edgeEnd, point))
            result = 0.5 * info.coeff;

        return result;
    }

    for (let i = 0; i < subjectInfo.length; ++i) {
        const edge = subjectInfo[i].edge;
        let edgeCharacter = 0;

        if (contains(clipInfo, edge)) {
            edgeCharacter = 1;
        } else {
            const reversedEdge = edge.reverse();
            for (let j = 0; j < clipInfo.length; ++j) {
                if (!contains(clipInfo, reversedEdge))
                    edgeCharacter += calculateBeta(edge.center, clipInfo[j]);
            }
        }

        if (edgeCharacter == 0) {
            resultSimplices.push(subjectInfo[i].edge);
        }
    }
    
    for (let i = 0; i < clipInfo.length; ++i) {
        let edgeCharacter = 0;
        const edge = clipInfo[i].edge;
        if (!contains(resultSimplices, edge)
        && !contains(resultSimplices, edge.reverse())) {
            edgeCharacter = 0;
                for (let j = 0; j < subjectInfo.length; ++j) {
                    if (!contains(subjectInfo, edge)
                    && !contains(subjectInfo, edge.reverse())) {
                        edgeCharacter += calculateBeta(clipInfo[i].edge.center, subjectInfo[j]);
                        }
                }

                if (edgeCharacter == 1) {
                    resultSimplices.push(edge.reverse());
                }
            }
    }

    return resultSimplices;
}

const buildPolygonsFromChain = (simplices: Edge[]) => {
    const result: Vertices[] = [];
    while (simplices.length > 0) {
        const output: Vector2[] = [];
        output.push(simplices[0].edgeStart);
        output.push(simplices[0].edgeEnd);

        simplices.splice(0, 1);

        let closed = false;
        let index = 0;
        let count = simplices.length;

        while (!closed && simplices.length > 0) {
            if (output[output.length - 1].equals(simplices[index].edgeStart)) {
                if (simplices[index].edgeEnd.equals(output[0]))
                    closed = true;
                else output.push(simplices[index].edgeEnd);

                simplices.splice(index--, 1);
            } else if (output[output.length - 1].equals(simplices[index].edgeEnd)) {
                if (simplices[index].edgeEnd.equals(output[0]))
                    closed = true;
                else output.push(simplices[index].edgeStart);

                simplices.splice(index--, 1);
            }

            if (!closed) {
                if (++index == simplices.length) {
                    if (count == simplices.length) {
                        console.error("Undefined error while building result polygon(s).");
                        return [];
                    }
                    index = 0;
                    count = simplices.length;
                }
            }
        }

        if (output.length < 3) {
            console.error("Degenerated output polygon produced (vertices < 3).");
        }

        result.push(new Vertices(output));
    }

    return result;
}

/**
 * Determines whether a point is in a simplex.
 * @param point The point
 * @param simplex The simplex
 */
const pointInSimplex = (point: Vector2, simplex: Edge) => new Vertices([
        Vector2.zero,
        simplex.edgeStart,
        simplex.edgeEnd
    ]).contains(point);

/**
 * Determines whether a point lies on a line.
 * @param start The start of the line
 * @param end The end of the line
 * @param point The point
 */
const pointOnLineSegment = (start: Vector2, end: Vector2, point: Vector2) => {
    const segment = end.sub(start);
    return area(start, end, point) == 0
        && point.sub(start).dot(segment) >= 0
        && point.sub(end).dot(segment) <= 0;
}

class Edge {
    edgeStart: Vector2;
    edgeEnd: Vector2;

    get center() {
        return this.edgeEnd.add(this.edgeStart).div(2);
    }

    constructor(start: Vector2, end: Vector2) {
        this.edgeStart = start;
        this.edgeEnd = end;
    }

    reverse() {
        return new Edge(this.edgeEnd, this.edgeStart);
    }

    equals(edge: Edge) {
        if (!edge) return false;

        return this.edgeStart.equals(edge.edgeStart) && this.edgeEnd.equals(edge.edgeEnd);
    }

    hashCode() {
        return this.edgeStart.hashCode() ^ this.edgeEnd.hashCode();
    }
}

interface CoeffEdge {
    edge: Edge;
    coeff: number;
}