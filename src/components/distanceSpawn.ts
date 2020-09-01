import { Entityish } from "../systems/system";

export class DistanceSpawn {
    type: 'distanceSpawn' = 'distanceSpawn';
    nextSpawn: number;
    spawnEvery: number = 5;

    spawn: () => Entityish<['transform']>;

    constructor(spawn: () => Entityish<['transform']>) {
        this.spawn = spawn;
    }
}