import { Engine } from "../engine";

export default function addRemoveAfterTime(engine: Engine) {
    engine
    .makeSystem('aliveForTime')
    .onEach('tick', (entity, message) => {
        entity.aliveForTime.remainingTime -= message['step'];

        if (entity.aliveForTime.remainingTime < 0) {
            engine.removeEntity(entity);
        }
    });
}