import ContactTracker from "./contactTracker";
import { Entity } from "../entity";
import Vector2 from "../core/vector2";

export default class RemoveWhenFar {
    type: 'removeWhenFar' = 'removeWhenFar';

    far: number;
    from: Entity;
    inDirection?: Vector2;

    constructor(far: number, from?: Entity, inDirection?: Vector2) {
        this.far = far;
        this.from = from;
        this.inDirection = inDirection;
    }
}