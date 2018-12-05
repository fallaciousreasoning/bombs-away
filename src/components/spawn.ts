import { Entity } from "../entity";

export default class Spawn {
    type: 'spawn' = 'spawn';
    spawnRate = 0.2;
    tillNextSpawn: number = 0;

    buildSpawn: (parent: Entity) => Entity;

    constructor(buildSpawn: (parent: Entity) => Entity) {
        this.buildSpawn = buildSpawn;
    }
}