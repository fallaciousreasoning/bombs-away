import Vector2 from "../core/vector2";
import { Color } from "../core/color";
import { random, randomColor } from "../utils/random";

export class GeneralConstraint {
    min: number;
    max: number;

    constructor(min: number, max: number = min) {
        this.min = min;
        this.max = max;
    }

    getNextValue() {
        return random(this.min, this.max);
    }
}

export class RandomVector2Generator {
    min: Vector2;
    max: Vector2;

    private maxLength: number;
    private centroid: Vector2;

    private calcLengthAndCentroid() {
        this.centroid = this.min.add(this.max).div(2);
        this.maxLength = this.max.sub(this.min).length();
    }

    static fromMinMax(min: Vector2, max: Vector2 = min) {
        const g = new RandomVector2Generator();
        g.min = min;
        g.max = max;

        g.calcLengthAndCentroid();
        return g;
    }

    static fromRadius(radius: number, centroid = Vector2.zero) {
        const v = new Vector2(radius, 0); 
        const min = v.rotate(-Math.PI/4 * 3).add(centroid);
        const max = v.rotate(Math.PI/4).add(centroid);
    
        return this.fromMinMax(min, max);
    }

    getNextValue() {
        const randomAngle = random(Math.PI*2);
        const length = random(this.maxLength);

        return new Vector2(length, 0)
            .rotate(randomAngle)
            .add(this.centroid);
    }
}

export class RandomColorGenerator {
    min: Color;
    max: Color;

    constructor(min: Color, max: Color=min) {
        this.min = min;
        this.max = max;
    }

    getNextValue() {
        return randomColor(this.min, this.max).toHexString();
    }
}