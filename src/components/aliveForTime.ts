import { Color } from "../core/color";

export default class AliveForTime {
    type: "aliveForTime" = "aliveForTime";
    remainingTime: number;

    aliveColor?: Color;
    deadColor?: Color;

    private time_: number;

    get time() {
        return this.time_;
    }

    get percent() {
        return Math.min(0, this.remainingTime / this.time_);
    }

    constructor(time: number) {
        this.time_ = time;
        this.remainingTime = time;
    }
}