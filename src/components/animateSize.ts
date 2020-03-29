import Vector2 from "../core/vector2";

const easingFunctions = {
    sin: p => Math.sin(p * Math.PI),
    exp: p => Math.exp(1 - (1/p**4))
}

export default class AnimateSize {
    type: "animateSize" = "animateSize";

    start: Vector2;
    end: Vector2;

    timeTillEnd: number;
    duration: number;

    easingFunc: (percent: number) => number = easingFunctions.exp;

    constructor(start: Vector2, end: Vector2, duration: number) {
        this.start = start;
        this.end = end;
        this.timeTillEnd = duration;
        this.duration = duration;
    }

    get percentage() {
        const p = Math.min(1, 1 - this.timeTillEnd/this.duration);
        if (!this.easingFunc)
            return p;

        return this.easingFunc(p);
    }
}