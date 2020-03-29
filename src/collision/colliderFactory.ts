import { Collider } from "../components/collider";
import { makeBox, makeCircle, makeBomb } from "../geometry/createPolygon";
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

    collider.fixtures = [
        new Fixture(makeBomb(width, height)),
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