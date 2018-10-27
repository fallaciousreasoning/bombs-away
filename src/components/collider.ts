import Vector2 from "../core/vector2";
import { Vertices } from "../geometry/vertices";

export interface Collider {
    type: 'collider';

    elasticity: number;

    vertices: Vertices;
    isTrigger?: boolean;
}