import { Engine } from "../engine";

export default function removeDeadThings(engine: Engine) {
    engine
        .makeSystem('health')
        .onEach('tick', (entity) => {
            if (entity.health.health <= 0) {
                engine.removeEntity(entity);
            }
        });

    engine.makeSystem('removeWhenFar', 'transform')
        .onEach('tick', ({ id, removeWhenFar, transform }) => {
            if (!removeWhenFar.from)
                throw new Error('Must be measuring from something!');

            const fromTransform = removeWhenFar.from.get('transform');
            if (!fromTransform)
                throw new Error('From must have a transform!');

            // A vector from this entity to the one it is checking it's distance from.
            const meToFrom = transform.position.sub(fromTransform.position);
            // If we have a specific direction we care about, find the
            // magnitude of the vector in that direction. Otherwise,
            // just use the absolute distance.
            const distance = removeWhenFar.inDirection
                ? removeWhenFar.inDirection.dot(meToFrom)
                : meToFrom.lengthSquared();
            
            if (distance > removeWhenFar.far)
                engine.removeEntity(id);
        });
}