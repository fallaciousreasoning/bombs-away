export default class AliveForTime {
    type: "aliveForTime" = "aliveForTime";
    remainingTime: number;

    private time_: number;

    get time() {
        return this.time_;
    }

    constructor(time: number) {
        this.time_ = time;
        this.remainingTime = time;
    }
}