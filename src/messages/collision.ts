import Vector2 from "../core/vector2";
import { Entity } from "../systems/system";

export interface Collision {
    type: 'collision';

    moved: Entity<['body', 'transform']>;
    movedAmount: Vector2;

    hit: Entity<['body', 'transform']>;

    normal: Vector2;
    penetration: number;
}