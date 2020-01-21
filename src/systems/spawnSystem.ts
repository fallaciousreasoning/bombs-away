import Input from "../core/input";
import { Engine } from "../engine";
import { input } from "../game";
import Vector2 from "../core/vector2";

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
                const collider = entity.get('collider');

                const spawned = spawn.buildSpawn();
                spawned.transform.parent = entity.transform;

                if (collider) {
                    const position = new Vector2(collider.bounds.width * Math.random(), 0);
                    spawned.transform.localPosition = position;
                }
                engine.addEntity(spawned);
                spawn.tillNextSpawn = spawn.spawnRate;
            }
        });
}