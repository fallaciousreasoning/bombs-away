import { Vertices } from "./vertices";
import Vector2 from "../core/vector2";
import { IntersectionInfo } from "./intersectionInfo";
import { lineIntersection } from "./utils";

export const cut = (shape: Vertices, lineStart: Vector2, lineEnd: Vector2): [Vertices, Vertices?] => {
    let cutStart: IntersectionInfo;
    let cutEnd: IntersectionInfo;

    for (let i = 0; i < shape.length; ++i) {
        const start = shape.getVertex(i);
        const end = shape.getVertex(i + 1);

        const intercept = lineIntersection(start, end, lineStart, lineEnd);

        if (!intercept) {
            continue;
        }

        const info: IntersectionInfo = { firstIndex: i, intercept: intercept };
        
        if (cutStart) {
            cutEnd = info;
            break;
        }

        cutStart = info;
    }

    if (!cutEnd) {
        return [shape];
    }

    window['debugPoints'].push(cutStart.intercept);
    window['debugPoints'].push(cutEnd.intercept);

    const tempShape = new Vertices([...shape.vertices]);
    tempShape.vertices.splice(cutStart.firstIndex, 0, cutStart.intercept);
    tempShape.vertices.splice(cutEnd.firstIndex, 0, cutEnd.intercept);

    // TODO construct the new shapes!

    const a = tempShape.slice(0, 0);
    const b = tempShape.slice(1, 1);

    return [a, b]
}