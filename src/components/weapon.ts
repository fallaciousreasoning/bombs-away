import { Entity } from "../entity";
import { Transform } from "./transform";

export default class Weapon {
    name: 'weapon' = 'weapon';
    fireRate = 0.4;
    damage = 1;
    range = 10;
    accuracy = 0.8;

    nextShotIn = 0;

    buildBullet: (weapon: Weapon, at: Transform) => Entity;

    constructor(buildBullet: (weapon: Weapon, at: Transform) => Entity) {
        this.buildBullet = buildBullet;
    }
}