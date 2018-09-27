import Vector2 from "../core/vector2";
import { Entity } from "../entity";
import Component from "./component";

export default class Weapon implements Component {
    name = 'weapon';
    fireRate = 0.4;
    damage = 1;
    range = 5;

    nextShotIn = 0;

    buildBullet: (weapon: Weapon, at: Vector2) => Entity;

    constructor(buildBullet: (weapon: Weapon, at: Vector2) => Entity) {
        this.buildBullet = buildBullet;
    }
}