import Input from "../core/input";
import { Engine } from "../engine";
import { input } from "../game";
import Vector2 from "../core/vector2";
import { randomValue, random, randomInBounds } from "../utils/random";

export default function addSpawn(engine: Engine) {
    engine
        .makeSystem('transform', 'spawn')
        .onEach('tick', (entity, message) => {
            const spawn = entity.spawn;
            const probability = entity.spawn.spawnRate * message.step;

            if (random() > probability)
                return;
            const collider = entity.get('collider');

            const spawned = spawn.makeSpawn();
            const spawnedTransform = spawned.get('transform');
            if (spawnedTransform) {
                spawnedTransform.position = collider
                    ? randomInBounds(collider.bounds)
                    : entity.transform.position;
            }

            const body = spawned.get('body');
            if (body && body.isDynamic) {
                body.angularVelocity = random(-1, 1);
            }
            engine.addEntity(spawned);
            spawn.tillNextSpawn = spawn.spawnRate;
        });
}