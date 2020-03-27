import Vector2 from "../core/vector2";

export default class VelocityClamp {
    type: 'velocityClamp' = 'velocityClamp';
    maxVelocity: number;
    maxAngularVelocity: number;

    constructor(maxVelocity: number = 1, maxAngularVelocity: number = 1) {
        this.maxVelocity = maxVelocity;
        this.maxAngularVelocity = maxAngularVelocity;
    }
}