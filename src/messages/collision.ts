import Vector2 from "../core/vector2";
import { Entityish } from "../systems/system";

interface CollisionInfo {
    entity: Entityish<['collider', 'transform']>;
    hit: Entityish<['collider', 'transform']>;

    normal: Vector2;
    penetration: number;

    elasticity: number;
    friction: number;
    velocityAlongNormal: number;
    contacts: Vector2[];
}

export type Collision = {
    type: 'collision';
} & CollisionInfo;

export type CollisionEnter = {
    type: 'collision-enter';
} & CollisionInfo;

export type CollisionExit = {
    type: 'collision-exit';
} & CollisionInfo;

export type Trigger = {
    type: 'trigger';
} & CollisionInfo;

export type TriggerEnter = {
    type: 'trigger-enter';
} & CollisionInfo;

export type TriggerExit = {
    type: 'trigger-exit';
} & CollisionInfo;