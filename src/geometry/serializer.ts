import Vector2 from "../core/vector2";
import { Vertices } from "./vertices";

const vertexSeparator = '\n';
const dimensionSeparator = ' ';

export const verticesToString = (vertices: Vertices) => {
    return vertices.vertices.map(v => `${v.x}${dimensionSeparator}${v.y}`).join(vertexSeparator);
}

export const verticesFromString = (verticesString: string) => {
    const vertices = verticesString.split(vertexSeparator).map(vectorString => {
        const parts = vectorString.split(dimensionSeparator).map(p => parseFloat(p));
        return new Vector2(parts[0], parts[1]);
    });
    return new Vertices(vertices);
}