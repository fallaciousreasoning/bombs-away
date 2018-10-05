import { Entity } from "../entity";
import { Transform } from "./transform";

export default class Spawn {
    type: 'spawn' = 'spawn';
    spawnRate = 5;
    tillNextSpawn: number;

    buildSpawn: (spawn: Spawn, at: Transform) => Entity;

    constructor(buildSpawn: (spawn: Spawn, at: Transform) => Entity) {
        this.buildSpawn = buildSpawn;
    }
}