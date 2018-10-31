import { Entity } from "../entity";

export default class Explodes {
    type: "explodes" = "explodes";
    with: (from: Entity) => Entity;

    constructor(w: (from: Entity) => Entity) {
        this.with = w;
    }
}