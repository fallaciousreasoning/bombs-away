import { Engine } from "../engine";
import Vector2 from "../core/vector2";

export default function naivePhysicsResolver(engine: Engine) {
    engine.makeSystem('transform', 'body')
        .onMessage("collision", (message) => {
            const normal = message.normal;
            const relativeVelocity = message.hit.body.velocity.sub(message.moved.body.velocity);
            const velocityAlongNormal = normal.dot(relativeVelocity);

            // If we're already moving apart, don't do anything.
            if (velocityAlongNormal > 0)
                return;

            const elasticity = 0.5;

            const magnitude = -(1 + elasticity) * velocityAlongNormal;
            let impulse = normal
                .mul(magnitude);

            message.moved.body.velocity = message.moved.body
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