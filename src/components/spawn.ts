import { Entity } from "../entity";
import { Entityish } from "../systems/system";
import { randomValue } from "../utils/random";

type Spawner = () => Entity;

type RateGetter = number | ((elapsedTime: number) => number)

export default class Spawn {
    type: 'spawn' = 'spawn';

    // Spawns once per second.
    spawnRate: RateGetter = 5;

    // The variance of the spawn rate.
    variance: RateGetter = 0;

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