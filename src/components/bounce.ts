export class Bounce {
    type: 'bounce' = 'bounce';
    bounciness: number;

    x: boolean;
    y: boolean;

    constructor(bounciness: number, x: boolean=false, y: boolean=true) {
        this.bounciness = bounciness;
        this.x = x;
        this.y = y;
    }
}