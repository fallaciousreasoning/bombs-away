import Vector2 from "../core/vector2";

export interface ParticleConstraint<T> {
    min: T;
    max: T;

    getNextValue: () => T;
}

export class GeneralConstraint implements ParticleConstraint<number> {
    min: number;
    max: number;

    constructor(min: number, max: number=min) {
        this.min = min;
        this.max = max;
    }

    getNextValue() {
        return this.min + Math.random() * (this.max - this.min);
    }
}