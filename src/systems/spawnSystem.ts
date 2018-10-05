import { Engine } from "../engine";

export default function addSpawn(engine: Engine) {
    engine
        .makeSystem('transform', 'spawn')
        .onEach('tick', ({ transform, spawn }, message) => {
            if (isNaN(spawn.tillNextSpawn)) {
                spawn.tillNextSpawn = spawn.spawnRate;
            }

            spawn.tillNextSpawn -= message.step;

            if (spawn.tillNextSpawn < 0) {
                engine.addEntity(spawn.buildSpawn(spawn, transform));
                spawn.tillNextSpawn = spawn.spawnRate;
            }
        });
}