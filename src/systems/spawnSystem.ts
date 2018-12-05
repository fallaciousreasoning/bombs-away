import Input from "../core/input";
import { Engine } from "../engine";

export default function addSpawn(engine: Engine, input: Input) {
    engine
        .makeSystem('transform', 'spawn')
        .onEach('tick', (entity, message) => {
            const spawn = entity.spawn;
            if (isNaN(spawn.tillNextSpawn)) {
                spawn.tillNextSpawn = spawn.spawnRate;
            }

            spawn.tillNextSpawn -= message.step;

            if (spawn.tillNextSpawn < 0 && input.getAxis('jump')) {
                engine.addEntity(spawn.buildSpawn(entity));
                spawn.tillNextSpawn = spawn.spawnRate;
            }
        });
}