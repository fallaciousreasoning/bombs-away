import { makeBox, makeCircle } from "../geometry/createPolygon";
import { Collider } from "../components/collider";

export const boxCollider = (width: number, height: number): Collider => {
    return {
        type: 'collider',
        collider: 'polygon',
        vertices: makeBox(width, height)
    }
}

export const circleCollider = (radius: number, segments: number=8): Collider => {
    return {
        type: 'collider',
        collider: 'polygon',
        vertices: makeCircle(radius, segments)
    };
}