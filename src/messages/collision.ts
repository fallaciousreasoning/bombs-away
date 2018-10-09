import Vector2 from "../core/vector2";
import { Entityish } from "../systems/system";

export interface Collision {
    type: 'collision';

    hash: number;

    moved: Entityish<['body', 'transform']>;
    movedAmount: Vector2;

    hit: Entityish<['body', 'transform']>;

    normal: Vector2;
    penetration: number;
}