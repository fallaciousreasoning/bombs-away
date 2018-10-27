import { Engine } from "../engine";
import Vector2 from "../core/vector2";

export default function naivePhysicsResolver(engine: Engine) {
    engine.makeSystem('transform', 'body')
        .onMessage("collision", (message) => {
            const movedBody = message.moved.get('body');
            
            if (!movedBody) {
                return;
            }
            
            const normal = message.normal;
            const bBody = message.hit.get('body');

            const relativeVelocity = bBody
                ? bBody.velocity.sub(movedBody.velocity)
                : Vector2.zero.sub(movedBody.velocity);

            const velocityAlongNormal = normal.dot(relativeVelocity);

            // If we're already moving apart, don't do anything.
            if (velocityAlongNormal > 0)
                return;

            const elasticity = 0.5;

            const magnitude = -(1 + elasticity) * velocityAlongNormal;
            let impulse = normal
                .mul(magnitude);

            movedBody.velocity = movedBody
                .velocity
                .sub(impulse);

            // Positional correction, so we don't sink into things.
            if (message.penetration > 0.005)
                message.moved.transform.position = message
                    .moved
                    .transform
                    .position
                    .sub(message.normal
                        .mul(message.penetration).mul(0.1));

        });
}