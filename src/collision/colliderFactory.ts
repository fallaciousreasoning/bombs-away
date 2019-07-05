import { Collider } from "../components/collider";
import { makeBox, makeCircle } from "../geometry/createPolygon";
import { Fixture } from "./fixture";

export const boxCollider = (width: number, height: number): Collider => {
    let collider = new Collider();
    collider.elasticity = 0.05;
    collider.friction = 0.5;

    let fixture = new Fixture();
    fixture.vertices = makeBox(width, height)
    collider.fixtures = [fixture];

    return collider;
}

export const circleCollider = (radius: number, segments: number=8): Collider => {
    let collider = new Collider();
    collider.elasticity = 0.05;
    collider.friction = 0;

    let fixture = new Fixture();
    fixture.vertices = makeCircle(radius, segments);
    collider.fixtures = [fixture];
    
    return collider;
}