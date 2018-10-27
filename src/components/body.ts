import Vector2 from "../core/vector2";

export default class Body {
    type: 'body' = 'body';

    isDynamic: boolean;

    velocity = new Vector2();
    density = 1.0;

    constructor(isDynamic?: boolean){
        this.isDynamic = isDynamic;
    }
}