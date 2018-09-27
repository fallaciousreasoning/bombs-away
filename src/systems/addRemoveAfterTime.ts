import AliveForTime from "../components/aliveForTime";
import { Engine } from "../engine";

export default function addRemoveAfterTime(engine: Engine) {
    engine.subscriber
    .on('tick')
    .with('aliveForTime')
    .map((entity) => {
        const aliveForTime: AliveForTime = entity.components.aliveForTime;
        aliveForTime.time -= entity.message['step'];

        if (aliveForTime.time < 0) {
            engine.removeEntity(entity as any);
        }
    });
}