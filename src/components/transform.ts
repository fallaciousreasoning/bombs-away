import Vector2 from "../core/vector2";
import Component from "./component";

export class Transform implements Component {
    name = 'Transform';

    constructor(position?: Vector2, rotation?: number){
        this.position = position || new Vector2();
        this.rotation = rotation || 0;
    }

    position: Vector2;
    rotation: number;
}