import { Vertices } from "./vertices";
import Vector2 from "../core/vector2";
import { IntersectionInfo } from "./intersectionInfo";
import { lineIntersection } from "./utils";

export const cut = (shape: Vertices, lineStart: Vector2, lineEnd: Vector2): [Vertices, Vertices?] => {
    const interceptMap = new Map<number, Vector2>();

    for (let i = 0; i < shape.length; ++i) {
        const start = shape.getVertex(i);
        const end = shape.getVertex(i + 1);

        const intercept = lineIntersection(start, end, lineStart, lineEnd);

        if (!intercept) {
            continue;
        }

        interceptMap.set(i, intercept);

        // We only need two intercepts for a cut.
        if (interceptMap.size >= 2) break;
    }

    // We needs at least two intercepts for a cut.
    if (interceptMap.size < 2) {
        return [shape];
    }

    let buildingA = true;
    const a = [];
    const b = [];

    for (let i = 0; i < shape.length; ++i) {
        const vertex = shape.getVertex(i);

        if (buildingA) a.push(vertex);
        else b.push(vertex);

        const intercept = interceptMap.get(i);
        if (!intercept) {
            continue;
        }

        a.push(intercept);
        b.push(intercept);
        buildingA = !buildingA;
    }

    console.log(a, b)

    return [new Vertices(a), new Vertices(b)]
}