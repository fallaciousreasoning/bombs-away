import { Engine } from "../engine";

export default function applyDamage(engine: Engine) {
    engine
        .makeSystem('health')
        .onTargetedMessage('collision-enter', ({ entity, hit }) => {
            if (hit.has('damage'))
                entity.health.health -= hit.damage.damage;
        });
}