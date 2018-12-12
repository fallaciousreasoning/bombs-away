import Vector2 from "../core/vector2";
import { Vertices } from "./vertices";

const vertexSeparator = '\n';
const dimensionSeparator = ' ';

export const polygonsToString = (polygons: Vertices[]) => {
    return polygons.map(verticesToString).join("\n=====\n");
}

export const verticesToString = (vertices: Vertices) => {
    return vertices.vertices.map(v => `${Math.round(v.x*100)/100}${dimensionSeparator}${Math.round(v.y*100)/100}`).join(vertexSeparator);
}

export const polygonsFromString = (polygonsString: string) => {
    return polygonsString.split("\n=====\n").map(verticesFromString);
}

export const verticesFromString = (verticesString: string) => {
    const vertices = verticesString.split(vertexSeparator).map(vectorString => {
        const parts = vectorString.split(dimensionSeparator).map(p => parseFloat(p));
        return new Vector2(parts[0], parts[1]);
    });
    return new Vertices(vertices);
}