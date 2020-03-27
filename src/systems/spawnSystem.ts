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

            if (spawn.tillNextSpawn < 0) {
                const collider = entity.get('collider');

                const spawned = spawn.buildSpawn();
                if (collider) {
                    spawned.transform.position = new Vector2(
                        collider.bounds.width * Math.random(),
                        entity.transform.position.y);
                }

                const body = spawned.get('body');
                if (body && body.isDynamic) {
                    body.angularVelocity = (Math.random() - 0.5) * 10
                }
                engine.addEntity(spawned);
                spawn.tillNextSpawn = spawn.spawnRate;
            }
        });
}