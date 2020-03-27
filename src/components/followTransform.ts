import { Transform } from "./transform";
import { Entity } from "../entity";
import Vector2 from "../core/vector2";

interface FollowOptions {
    lockX?: boolean;
    lockY?: boolean;
    offset?: Vector2;
    spring?: number;
}

export class FollowTransform implements FollowOptions{
    type: 'followTransform' = 'followTransform';
    follow: Entity;

    spring?: number;
    lockX?: boolean;
    lockY?: boolean;
    offset?: Vector2;

    constructor(follow?: Entity, options?: FollowOptions) {
        this.follow = follow;
        
        if (!options)
          return;

        for (const key in options)
            this[key] = options[key];
    }
}