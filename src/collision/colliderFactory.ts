import { Collider } from "../components/collider";
import { makeBox, makeCircle } from "../geometry/createPolygon";
import { Fixture } from "./fixture";
import { Vertices } from "../geometry/vertices";

export const boxCollider = (width: number, height: number): Collider => {
    let collider = new Collider();
    collider.elasticity = 0.05;
    collider.friction = 0.5;
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

export const fromVertices = (vertices: Vertices) => {
    let collider = new Collider();
    collider.elasticity = 0.05;
    collider.friction = 0.5;
    collider.fixtures = [
        new Fixture(vertices)
    ];
    return collider;
}