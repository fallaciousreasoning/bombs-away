import { makeBox, makeCircle } from "../geometry/createPolygon";
import { Collider } from "../components/collider";

export const boxCollider = (width: number, height: number): Collider => {
    return {
        type: 'collider',
        elasticity: 0.5,
        friction: 0,
        vertices: makeBox(width, height)
    }
}

export const circleCollider = (radius: number, segments: number=8): Collider => {
    return {
        type: 'collider',
        friction: 0,
        elasticity: 0,
        vertices: makeCircle(radius, segments)
    };
}