import * as earcut from 'earcut';
import Vector2 from '../core/vector2';
import { Vertices } from "./vertices";


export const convexPartition = (polygon: Vertices) : Vertices[] => {
    const flattened: number[] = polygon.vertices.reduce((prev, next) => [...prev, next.x, next.y], []);
    const indices: number[] = earcut(flattened);

    const vertex = (index: number) => new Vector2(flattened[index * 2], flattened[index*2 + 1]);

    const vertices: Vertices[] = [];
    for (let i = 0; i < indices.length; i += 3) {
        vertices.push(new Vertices([
            vertex(indices[i]),
            vertex(indices[i + 1]),
            vertex(indices[i + 2])
        ]));
    }

    return vertices;
}