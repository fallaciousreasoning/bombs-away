import Vector2 from "../core/vector2";
import { Vertices } from "../geometry/vertices";

type Polygon = {
    collider: 'polygon';

    vertices: Vertices;
    isTrigger?: boolean;
}

type Line = {
    collider: 'line';

    length: number;
    direction: Vector2;
    isTrigger: true;
}

type Circle = {
    collider: 'circle';

    radius: number;
    isTrigger: true;
}

export type Collider = { type: 'collider', color?: string } & (Polygon/* | Line | Circle*/); // TODO enable more shapes.