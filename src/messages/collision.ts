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

export interface CollisionEnter {
    type: 'collision-enter';

    moved: Entityish<['body', 'transform']>;
    movedAmount: Vector2;

    hit: Entityish<['body', 'transform']>;

    normal: Vector2;
    penetration: number;
}

export interface CollisionExit {
    type: 'collision-exit';

    moved: Entityish<['body', 'transform']>;
    hit: Entityish<['body', 'transform']>;
}

export interface Trigger {
    type: 'trigger';

    hash: number;

    moved: Entityish<['body', 'transform']>;
    movedAmount: Vector2;

    hit: Entityish<['body', 'transform']>;

    normal: Vector2;
    penetration: number;
}

export interface TriggerEnter {
    type: 'trigger-enter';

    moved: Entityish<['body', 'transform']>;
    movedAmount: Vector2;

    hit: Entityish<['body', 'transform']>;

    normal: Vector2;
    penetration: number;
}

export interface TriggerExit {
    type: 'trigger-exit';

    moved: Entityish<['body', 'transform']>;
    hit: Entityish<['body', 'transform']>;
}