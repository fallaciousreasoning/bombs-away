import Vector2 from "../core/vector2";
import { Vertices } from "../geometry/vertices";

export interface Collider {
    type: 'collider';

    vertices: Vertices;
    isTrigger?: boolean;
}