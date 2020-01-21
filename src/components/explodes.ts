import { Entity } from "../entity";

export default class Explodes {
    type: "explodes" = "explodes";
    radius: number = 1;
    with: (from: Entity) => Entity;

    constructor(w: (from: Entity) => Entity) {
        this.with = w;
    }
}