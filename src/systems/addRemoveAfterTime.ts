import { Engine } from "../engine";

export default function addRemoveAfterTime(engine: Engine) {
    engine
    .makeSystem('aliveForTime')
    .onEach('tick', (entity, message) => {
        entity.aliveForTime.time -= message['step'];

        if (entity.aliveForTime.time < 0) {
            throw new Error("Can't do this yet :'(");
            engine.removeEntity(entity as any);
        }
    });
}