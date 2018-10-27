import Vector2 from "../core/vector2";

export default class Body {
    type: 'body' = 'body';

    isDynamic = true;

    velocity = new Vector2();
    density: number;

    constructor(density=1){
        this.density = density;
    }
}