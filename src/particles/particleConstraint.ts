import Vector2 from "../core/vector2";
import { Color } from "../core/color";

export class GeneralConstraint {
    min: number;
    max: number;

    constructor(min: number, max: number = min) {
        this.min = min;
        this.max = max;
    }

    getNextValue() {
        return this.min + Math.random() * (this.max - this.min);
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
        const randomAngle = Math.random() * Math.PI * 2;
        const length = this.maxLength * Math.random();

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
        const channels = ['r', 'g', 'b'];
        let result: [number, number, number] = [0,0,0];
        for (let i = 0; i < channels.length; ++i) {
            let channel = channels[i];
            result[i] = this.min[channel] + (this.max[channel] - this.min[channel]) * Math.random();
        }

        return new Color(...result).toHexString();
    }
}