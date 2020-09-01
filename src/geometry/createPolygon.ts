import Vector2 from "../core/vector2";
import { Vertices } from "./vertices";

const boxVertices = new Vertices([
    new Vector2(-0.5, -0.5),
    new Vector2(0.5, -0.5),
    new Vector2(0.5, 0.5),
    new Vector2(-0.5, 0.5)
]);
// Calculate properties so they can be copied to all boxes.
boxVertices.calculateProperties();

export const makeBox = (width: number, height: number) => {
    return boxVertices.scale(new Vector2(width, height));
}

export const makeCircle = (radius: number, triangles = 8) => {
    const spoke = new Vector2(0, -radius);
    const angle = Math.PI/triangles * 2;
    const vertices = [spoke];

    for (let i = 1; i < triangles; ++i) {
        vertices.push(spoke.rotate(angle * i));
    }

    return new Vertices(vertices);
}

const numSpokes = 10;
const vertices = [
    // Top left
    new Vector2(-0.5, -0.5),
    // Top right
    new Vector2(0.5, -0.5),
];
const circleCentre = Vector2.zero;
const spoke = new Vector2(0.5, 0);

const rotateBy = Math.PI/numSpokes;
for (let i = 0; i < numSpokes; ++i) {
    vertices.push(spoke.rotate(rotateBy*i).add(circleCentre));
};
const bombVertices = new Vertices(vertices);
bombVertices.calculateProperties();

export const makeBomb = (width: number, height: number) => {
    return bombVertices.scale(new Vector2(width, height));
}