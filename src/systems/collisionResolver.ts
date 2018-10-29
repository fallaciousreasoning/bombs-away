import { Engine } from "../engine";
import Vector2 from "../core/vector2";
import { Entity } from "../entity";

// TODO: Not this.
const getInertia = (entity: Entity) => {
    const mass = getMass(entity);
    const collider = entity.get('collider');

    // TODO: Not this, we should use transform.position
    const centreOfMass = collider.vertices.centroid;

    // TODO: Not this, we're assuming the centroid is the centre of the shape.
    let prevDist: number;
    for (let i = 0; i < collider.vertices.length; ++i) {
        if (!prevDist) {
            prevDist = collider.vertices.getVertex(i - 1).distance(centreOfMass);
        }

        const distance = collider.vertices.getVertex(i).distance(centreOfMass);
    }
    return 0;
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

export default function naivePhysicsResolver(engine: Engine) {
    engine.makeSystem('transform', 'body')
        .onMessage("collision", (message) => {
            const movedBody = message.moved.get('body');

            if (!movedBody) {
                return;
            }

            const normal = message.normal;
            const bBody = message.hit.get('body');

            let relativeVelocity = bBody
                ? bBody.velocity.sub(movedBody.velocity)
                : Vector2.zero.sub(movedBody.velocity);

            const velocityAlongNormal = normal.dot(relativeVelocity);

            // If we're already moving apart, don't do anything.
            if (velocityAlongNormal > 0)
                return;

            const contacts = message.contacts.reduce((prev, next) => prev.add(next), Vector2.zero).div(message.contacts.length);

            // Work out how we're going to hand out the collision response.
            const invMass = getInvMass(message.moved);
            const totalInvMass = getInvMass(message.hit) + invMass;
            const invInertia = getInvInertia(message.moved);
            const bInvIntertia = getInertia(message.hit)
            const aInertiaDivisor = Math.pow(contacts.sub(message.moved.transform.position).cross(normal), 2) * invInertia;
            const bInertiaDivisor = Math.pow(contacts.sub(message.hit.transform.position).cross(normal), 2) * bInvIntertia;

            const magnitude = -(1 + message.elasticity) * velocityAlongNormal / (totalInvMass + aInertiaDivisor + bInertiaDivisor);
            let impulse = normal
                .mul(magnitude);

            movedBody.applyForce(impulse.mul(-1), message.contacts[0], invMass, invInertia);

            relativeVelocity = bBody
                ? bBody.velocity.sub(movedBody.velocity)
                : Vector2.zero.sub(movedBody.velocity);
            const tangent = relativeVelocity
                .sub(normal.mul(relativeVelocity.dot(normal)))
                .normalized();

            const velocityAlongTangent = tangent.dot(relativeVelocity);
            const frictionMagnitude = velocityAlongTangent / totalInvMass;
            const frictionImpulse = tangent
                .mul(frictionMagnitude)
                .mul(invMass)
                .mul(-message.friction);

            movedBody.velocity = movedBody.velocity.sub(frictionImpulse);

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