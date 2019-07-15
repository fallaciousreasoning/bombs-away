import { Transform } from "./transform";
import { Entity } from "../entity";

export class FollowTransform {
    type: 'followTransform' = 'followTransform';
    follow: Entity;
    spring: number = 10;

    constructor(follow?: Entity) {
        this.follow = follow;
    }
}