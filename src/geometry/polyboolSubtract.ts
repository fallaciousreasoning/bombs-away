import * as Polybool from 'polybooljs';
import Vector2 from "../core/vector2";
import { Vertices } from "./vertices";


interface PolyboolPoly {
    regions: (number[])[][],
    inverted: boolean
}

const toPolybool = (vertices: Vertices): PolyboolPoly => {
    return {
        regions: [
            vertices.vertices.map(v => [v.x, v.y])
        ],
        inverted: false
    };
}

const fromPolybool = (poly: PolyboolPoly): Vertices[] => {
    return poly.regions.map(r => {
        return new Vertices(
            r.map(point => new Vector2(point[0], point[1]))
        );
    });
}

export const difference = (subject: Vertices, subtract: Vertices) => {
    const subjectPoly = toPolybool(subject);
    const subtractPoly = toPolybool(subtract);

    const result = Polybool.difference(subjectPoly, subtractPoly);
    return fromPolybool(result);
}