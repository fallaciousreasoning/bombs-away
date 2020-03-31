import { Entity } from "../entity";
import { Entityish } from "../systems/system";
import { randomValue } from "../utils/random";

type Spawner = () => Entity;

export default class Spawn {
    type: 'spawn' = 'spawn';
    spawnRate = 1;
    tillNextSpawn: number = 0;

    spawnables: Spawner[] = [];
    addSpawnable(spawner: Spawner) {
        this.spawnables.push(spawner);
    }

    makeSpawn() {
        return randomValue(this.spawnables)();
    }

    constructor(...makeSpawn: Spawner[]) {
        this.spawnables = makeSpawn;
    }
}