import Vector2 from "../core/vector2";

export default class AnimateSize {
    type: "animateSize" = "animateSize";

    start: Vector2;
    end: Vector2;

    timeTillEnd: number;
    duration: number;

    constructor(start: Vector2, end: Vector2, duration: number) {
        this.start = start;
        this.end = end;
        this.timeTillEnd = duration;
        this.duration = duration;
    }

    get percentage() {
        return Math.min(1, 1 - this.timeTillEnd/this.duration);
    }
}