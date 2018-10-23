import Vector2 from "../core/vector2";

type Box = {
    collider: 'box';

    width: number;
    height: number;
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

export type Collider = { type: 'collider' } & (Box/* | Line | Circle*/); // TODO enable more shapes.