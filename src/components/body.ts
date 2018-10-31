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

    applyForce(force: Vector2, at: Vector2, invMass: number, invInertia: number=1) {
        const impulse = force.mul(invMass);
        this.velocity = this.velocity.add(impulse);

        this.angularVelocity += invInertia * at.cross(force) / 4;
    }
}