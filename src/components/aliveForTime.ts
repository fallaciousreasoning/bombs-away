import Component from "./component";

export default class AliveForTime implements Component {
    name = 'aliveForTime';
    time: number;

    constructor(time: number) {
        this.time = time;
    } 
}