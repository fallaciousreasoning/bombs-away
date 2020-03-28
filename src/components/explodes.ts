import { Entity } from "../entity";

export default class Explodes {
    type: "explodes" = "explodes";
    radius: number = 5;
    force: number = 100;

    with?: (radius: number) => Entity;
}