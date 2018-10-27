import { Engine } from "../engine";
import Vector2 from "../core/vector2";
import { Entity } from "../entity";

const getMass = (entity: Entity) => {
    const body = entity.get('body');
    if (!body || body.density === 0) {
        return 0;
    }

    const collider = entity.get('collider');
    return body.density * collider.vertices.area;
}

const getInvMass = (entity: Entity) => {
    const mass = getMass(entity);
    return mass == 0 ? 0 : 1/mass;
}

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

            // Work out how we're going to hand out the collision response.
            const movedMass = getMass(message.moved);
            const invMass = movedMass == 0 ? 0 : 1/movedMass;
            const totalInvMass = getInvMass(message.hit) + invMass;

            const magnitude = -(1 + message.elasticity) * velocityAlongNormal / totalInvMass;
            let impulse = normal
                .mul(magnitude)
                .mul(invMass);

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