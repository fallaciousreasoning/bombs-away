import Input from "../core/input";
import { Engine } from "../engine";
import { input } from "../game";

export default function addSpawn(engine: Engine) {
    engine
        .makeSystem('transform', 'spawn')
        .onEach('tick', (entity, message) => {
            const spawn = entity.spawn;
            if (isNaN(spawn.tillNextSpawn)) {
                spawn.tillNextSpawn = spawn.spawnRate;
            }

            spawn.tillNextSpawn -= message.step;

            if (spawn.tillNextSpawn < 0 && input.getAxis('jump')) {
                const spawned = spawn.buildSpawn(entity);
                engine.addEntity(spawned);
                spawn.tillNextSpawn = spawn.spawnRate;
            }
        });
}