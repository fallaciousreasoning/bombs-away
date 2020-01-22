import { Entity } from "../entity";
import { Entityish } from "../systems/system";

export default class Spawn {
    type: 'spawn' = 'spawn';
    spawnRate = 1;
    tillNextSpawn: number = 0;

    buildSpawn: () => Entityish<['transform']>;

    constructor(buildSpawn: () => Entityish<['transform']>) {
        this.buildSpawn = buildSpawn;
    }
}