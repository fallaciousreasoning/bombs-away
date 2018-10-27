import Vector2 from "../core/vector2";

export default class Body {
    type: 'body' = 'body';

    fixedRotation = false;
    isDynamic = true;

    velocity = new Vector2();
    angularVelocity = 0;

    density: number;

    constructor(density=1){
        this.density = density;
    }
}