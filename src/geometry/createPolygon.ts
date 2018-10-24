import Vector2 from "../core/vector2";
import { Vertices } from "./vertices";

const makeBox = (width: number, height: number) => {
    const halfSize = new Vector2(width, height).div(2);

    return new Vertices([
        new Vector2(halfSize.x, - halfSize.y),
        halfSize.mul(-1),
        new Vector2(-halfSize.x, halfSize.y),
        halfSize
    ]);
}

const makeCircle = (radius: number, triangles = 8) => {
    const spoke = new Vector2(0, radius);
    const angle = Math.PI/triangles * 2;
    const vertices = [spoke];

    for (let i = 1; i < triangles; ++i) {
        vertices.push(spoke.rotate(angle * i));
    }

    return new Vertices(vertices);
}