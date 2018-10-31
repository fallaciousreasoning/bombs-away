import { Collider } from "../components/collider";
import { makeBox, makeCircle } from "../geometry/createPolygon";

export const boxCollider = (width: number, height: number): Collider => {
    return {
        type: 'collider',
        elasticity: 0.05,
        friction: 0.5,
        vertices: makeBox(width, height)
    }
}

export const circleCollider = (radius: number, segments: number=8): Collider => {
    return {
        type: 'collider',
        friction: 0.05,
        elasticity: 0,
        vertices: makeCircle(radius, segments)
    };
}