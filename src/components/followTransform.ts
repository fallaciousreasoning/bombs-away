import { Transform } from "./transform";

export class FollowTransform {
    type: 'followTransform' = 'followTransform';
    follow: Transform;
    spring: number = 0.3;

    constructor(follow?: Transform) {
        this.follow = follow;
    }
}