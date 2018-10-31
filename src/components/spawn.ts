import { Entity } from "../entity";

export default class Spawn {
    type: 'spawn' = 'spawn';
    spawnRate = 5;
    tillNextSpawn: number;

    buildSpawn: (parent: Entity) => Entity;

    constructor(buildSpawn: (parent: Entity) => Entity) {
        this.buildSpawn = buildSpawn;
    }
}