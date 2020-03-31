import { Engine } from "../engine";
import { Color } from "../core/color";

export default function addRemoveAfterTime(engine: Engine) {
    engine
        .makeSystem('aliveForTime')
        .onEach('tick', (entity, message) => {
            entity.aliveForTime.remainingTime -= message['step'];

            if (entity.aliveForTime.remainingTime < 0) {
                engine.removeEntity(entity);
            }
        });

    engine.makeSystem('aliveForTime', 'colliderRenderer')
        .onEach('tick', ({ aliveForTime, colliderRenderer }) => {
            if (!aliveForTime.aliveColor || !aliveForTime.deadColor)
                return;

            const resultColor = Color.lerp(
                aliveForTime.aliveColor,
                aliveForTime.deadColor,
                aliveForTime.percent);
            colliderRenderer.fill = resultColor.hex;
        })
}