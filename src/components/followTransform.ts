import { Transform } from "./transform";
import { Entity } from "../entity";

export class FollowTransform {
    type: 'followTransform' = 'followTransform';
    follow: Entity;
    spring: number = 10;

    lockX: boolean;
    lockY: boolean;

    constructor(follow?: Entity, lockX?: boolean, lockY?: boolean) {
        this.follow = follow;
        this.lockX = lockX;
        this.lockY = lockY;
    }
}