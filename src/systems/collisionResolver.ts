import Vector2 from "../core/vector2";
import { Engine } from "../engine";
import { Entity } from "../entity";

/**
 * Calculates the inertia for a shape.
 * Based on formula here:
 * https://www.gamedev.net/forums/topic/342822-moment-of-inertia-of-a-polygon-2d/
 * @param entity The entity to get inertia for.
 */
const getInertia = (entity: Entity) => {
    const mass = getMass(entity);
    const collider = entity.get('collider');

    if (collider.vertices.length === 1) return 0;

    let denominator = 0;
    let numerator = 0;

    for (let i = 0; i < collider.vertices.length; ++i) {
        const v1 = collider.vertices.getVertex(i);
        const v2 = collider.vertices.getVertex(i + 1);

        let a  = Math.abs(v2.cross(v1));
        let b = v1.lengthSquared() + v1.dot(v2) + v2.lengthSquared();

        denominator += a * b;
        numerator += a;
    }
    
    const inertia = (mass/6) * (numerator/denominator);
    return inertia;
}

const getInvInertia = (entity: Entity) => {
    const inertia = getInertia(entity);

    return inertia == 0 ? 0 : 1/inertia;
}

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
    return mass == 0 ? 0 : 1 / mass;
}

const velocityAtPoint = (entity: Entity, at: Vector2) => {
    const body = entity.get('body');
    const transform = entity.get('transform');
    if (!body) {
        return Vector2.zero;
    }

    const relativePoint = at.sub(transform.position);
    const pointVelocity = Vector2.cross(body.angularVelocity, relativePoint); 
    return body.velocity.add(pointVelocity);
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

            const contact = message.contacts.reduce((prev, next) => prev.add(next), Vector2.zero).div(message.contacts.length);
            const aVelocity = velocityAtPoint(message.moved, contact);
            const bVelocity = velocityAtPoint(message.hit, contact);

            let relativeVelocity = bVelocity.sub(aVelocity);

            const velocityAlongNormal = normal.dot(relativeVelocity);

            // If we're already moving apart, don't do anything.
            if (velocityAlongNormal > 0)
                return;


            // Work out how we're going to hand out the collision response.
            const invMass = getInvMass(message.moved);
            const totalInvMass = getInvMass(message.hit) + invMass;
            const invInertia = getInvInertia(message.moved);
            const bInvIntertia = getInvInertia(message.hit)
            const aInertiaDivisor = Math.pow(contact.sub(message.moved.transform.position).cross(normal), 2) * invInertia;
            const bInertiaDivisor = Math.pow(contact.sub(message.hit.transform.position).cross(normal), 2) * bInvIntertia;

            const magnitude = -(1 + message.elasticity) * velocityAlongNormal / (totalInvMass + aInertiaDivisor + bInertiaDivisor);
            let impulse = normal
                .mul(magnitude);

            movedBody.applyForce(impulse.mul(-1), contact.sub(message.moved.transform.position), invMass, invInertia);

            relativeVelocity = bBody
                ? bBody.velocity.sub(movedBody.velocity)
                : Vector2.zero.sub(movedBody.velocity);
            const tangent = relativeVelocity
                .sub(normal.mul(relativeVelocity.dot(normal)))
                .normalized();

            // TODO: Friction.
            // const velocityAlongTangent = tangent.dot(relativeVelocity);
            // const frictionMagnitude = velocityAlongTangent / totalInvMass;
            // const frictionImpulse = tangent
            //     .mul(frictionMagnitude)
            //     .mul(invMass)
            //     .mul(-message.friction);

            // movedBody.velocity = movedBody.velocity.sub(frictionImpulse);

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