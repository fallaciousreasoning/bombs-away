import { Vertices } from "./vertices";
import Vector2 from "../core/vector2";
import { IntersectionInfo } from "./intersectionInfo";
import { lineIntersection } from "./utils";

export const cut = (shape: Vertices, lineStart: Vector2, lineEnd: Vector2): [Vertices, Vertices] => {
    let cutStart: IntersectionInfo;
    let cutEnd: IntersectionInfo;

    for (let i = 0; i < shape.length; ++i) {
        const start = shape.getVertex(i);
        const end = shape.getVertex(i + 1);

        const intercept = lineIntersection(start, end, lineStart, lineEnd);
        const info: IntersectionInfo = { firstIndex: i, intercept: intercept };
        
        if (cutStart) {
            cutEnd = info;
            break;
        }

        cutStart = info;
    }

    const a = shape.slice(cutStart.firstIndex, cutEnd.firstIndex);

    // Insert the cut vertices.
    a.vertices.splice(0, 0, cutStart.intercept);
    a.vertices.push(cutEnd.intercept);

    const b = shape.slice(cutEnd.firstIndex, cutStart.secondIndex);

    // Insert the cut vertices.
    b.vertices.splice(0, 0, cutEnd.intercept);
    b.vertices.push(cutStart.intercept);

    return [a, b]
}