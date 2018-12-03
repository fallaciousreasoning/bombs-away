import { Vertices } from "./vertices";

export const convexPartition = (polygon: Vertices) : Vertices[] => {
    return polygon.vertices.map((v, i) => {
        return new Vertices([
            polygon.getVertex(i),
            polygon.getVertex(i + 1),
            polygon.getVertex(i + 2)
        ]);
    });
}