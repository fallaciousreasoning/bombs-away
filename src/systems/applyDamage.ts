import { Engine } from "../engine";

export default function applyDamage(engine: Engine) {
    engine
        .makeSystem()
        .onMessage('collision-enter', ({ moved, hit }) => {
            const damage = moved.get('damage');
            const health = hit.get('health');

            if (!damage || !health) {
                return;
            }

            health.health -= damage.damage;
        });
}