import Vector2 from "../core/vector2";
import { Entityish } from "../systems/system";

export interface Collision {
    type: 'collision';

    moved: Entityish<['collider', 'transform']>;
    hit: Entityish<['collider', 'transform']>;

    normal: Vector2;
    penetration: number;
}

export interface CollisionEnter {
    type: 'collision-enter';

    moved: Entityish<['collider', 'transform']>;
    hit: Entityish<['collider', 'transform']>;

    normal: Vector2;
    penetration: number;
}

export interface CollisionExit {
    type: 'collision-exit';

    moved: Entityish<['collider', 'transform']>;
    hit: Entityish<['collider', 'transform']>;
}

export interface Trigger {
    type: 'trigger';

    moved: Entityish<['collider', 'transform']>;
    hit: Entityish<['collider', 'transform']>;

    normal: Vector2;
    penetration: number;
}

export interface TriggerEnter {
    type: 'trigger-enter';

    moved: Entityish<['collider', 'transform']>;
    hit: Entityish<['collider', 'transform']>;

    normal: Vector2;
    penetration: number;
}

export interface TriggerExit {
    type: 'trigger-exit';

    moved: Entityish<['collider', 'transform']>;
    hit: Entityish<['collider', 'transform']>;
}