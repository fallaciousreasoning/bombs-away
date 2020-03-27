import { Collider } from "../components/collider";
import { makeBox, makeCircle } from "../geometry/createPolygon";
import { Fixture } from "./fixture";
import { Vertices } from "../geometry/vertices";
import Vector2 from "../core/vector2";

export const boxCollider = (width: number, height: number, color?: string, isTrigger?: boolean): Collider => {
    let collider = new Collider();
    collider.color = color;
    collider.elasticity = 0.05;
    collider.friction = 0.5;
    collider.isTrigger = isTrigger;
    collider.fixtures = [
        new Fixture(makeBox(width, height))
    ];
    return collider;
}

export const circleCollider = (radius: number, segments: number = 8): Collider => {
    let collider = new Collider();
    collider.elasticity = 0.05;
    collider.friction = 0;
    collider.fixtures = [
        new Fixture(makeCircle(radius, segments))
    ];
    return collider;
}

export const bombCollider = (width: number, height: number): Collider => {
    const collider = new Collider();
    collider.elasticity = 0.1;
    collider.friction = 0.4;

    const numSpokes = 10;

    const vertices = [
        // Top left
        new Vector2(-width/2, -height/2),
        // Top right
        new Vector2(width/2, -height/2),
    ];

    const circleCentre = new Vector2(0, height/2 - width/2);
    const spoke = new Vector2(width/2, 0);

    const rotateBy = Math.PI/numSpokes;
    for (let i = 0; i < numSpokes; ++i) {
        vertices.push(spoke.rotate(rotateBy*i).add(circleCentre));
    };

    const v = new Vertices(vertices);
    v.forceCounterClockwise();
    collider.fixtures = [
        new Fixture(v),
    ];

    return collider;
}

export const fromVertices = (vertices: Vertices) => {
    let collider = new Collider();
    collider.elasticity = 0.05;
    collider.friction = 0.5;
    collider.fixtures = [
        new Fixture(vertices)
    ];
    return collider;
}