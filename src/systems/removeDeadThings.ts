import { Engine } from "../engine";

export default function removeDeadThings(engine: Engine) {
    engine
    .makeSystem('health')
    .onEach('tick', (entity) => {
        if (entity.health.health <= 0) {
            engine.removeEntity(entity);
        }
    });
}