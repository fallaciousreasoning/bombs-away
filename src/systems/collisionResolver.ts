import Vector2 from "../core/vector2";
import { Entity } from "../entity";
import { Island } from "./collisionDetector";

/**
 * Calculates the inertia for a shape.
 * Based on formula here:
 * https://www.gamedev.net/forums/topic/342822-moment-of-inertia-of-a-polygon-2d/
 * @param entity The entity to get inertia for.
 */
const getInertia = (entity: Entity) => {
    const mass = getMass(entity);
    const collider = entity.get('collider');

    let denominator = 0;
    let numerator = 0;

    for (const fixture of collider.fixtures) {
        for (let i = 0; i < fixture.vertices.length; ++i) {
            const v1 = fixture.vertices.getVertex(i);
            const v2 = fixture.vertices.getVertex(i + 1);

            let a = Math.abs(v2.cross(v1));
            let b = v1.lengthSquared() + v1.dot(v2) + v2.lengthSquared();

            denominator += a * b;
            numerator += a;
        }
    }

    if (denominator === 0) return 0;
    
    const inertia = (mass / 6) * (numerator / denominator);
    return inertia;
}

const getInvInertia = (entity: Entity) => {
    const inertia = getInertia(entity);

    return inertia == 0 ? 0 : 1 / inertia;
}

const getMass = (entity: Entity) => {
    const body = entity.get('body');
    if (!body || body.density === 0) {
        return 0;
    }

    const collider = entity.get('collider');
    return body.density * collider.area;
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

export default function solve(island: Island) {
    const aBody = island.a.get('body');
    const bBody = island.b.get('body');

    const normal = island.manifold.normal;

    const contact = island.manifold.contacts
        .reduce((prev, next) => prev.add(next), Vector2.zero).div(island.manifold.contacts.length);

    const aVelocity = velocityAtPoint(island.a, contact);
    const bVelocity = velocityAtPoint(island.b, contact);

    let relativeVelocity = bVelocity.sub(aVelocity);
    const velocityAlongNormal = normal.dot(relativeVelocity);

    // If we're already moving apart, don't do anything.
    if (velocityAlongNormal >= 0)
        return;

    // Work out how we're going to hand out the collision response.
    const aInvMass = getInvMass(island.a);
    const bInvMass = getInvMass(island.b);
    const totalInvMass = bInvMass + aInvMass;

    const aInvInertia = getInvInertia(island.a);
    const bInvIntertia = getInvInertia(island.b);
    const aInertiaDivisor = Math.pow(contact.sub(island.a.transform.position).cross(normal), 2) * aInvInertia;
    const bInertiaDivisor = Math.pow(contact.sub(island.b.transform.position).cross(normal), 2) * bInvIntertia;

    const elasticity = Math.min(island.a.collider.elasticity, island.b.collider.elasticity);

    let magnitude = -(1 + elasticity) * velocityAlongNormal / (totalInvMass + aInertiaDivisor + bInertiaDivisor);
    magnitude /= island.manifold.contacts.length;

    let impulse = normal
        .mul(magnitude);

    for (const contact of island.manifold.contacts) {
        aBody && aBody.applyForce(impulse.mul(-1), contact.sub(island.a.transform.position), aInvMass, aInvInertia);
        bBody && bBody.applyForce(impulse, contact.sub(island.b.transform.position), bInvMass, bInvIntertia);
    }

    // Friction
    relativeVelocity = velocityAtPoint(island.b, contact).sub(velocityAtPoint(island.a, contact));
    const tangent = relativeVelocity
        .sub(normal.mul(relativeVelocity.dot(normal)))
        .normalized();

    const friction = (island.a.collider.friction + island.b.collider.friction) / 2;

    const velocityAlongTangent = tangent.dot(relativeVelocity);
    const frictionMagnitude = velocityAlongTangent / (totalInvMass + aInertiaDivisor + bInertiaDivisor);
    const frictionImpulse = tangent
        .mul(frictionMagnitude)
        .mul(friction);

    // If the friction is toward the other object, don't apply it.
    if (normal.dot(frictionImpulse) < 0)
        return

    aBody && aBody.applyForce(frictionImpulse, contact.sub(island.a.transform.position), aInvMass, aInvInertia);
    bBody && bBody.applyForce(frictionImpulse.mul(-1), contact.sub(island.b.transform.position), bInvMass, bInvIntertia);

    const slop = 0.01;
    const percentCorrection = 1;
    const correction = island.manifold.normal.mul(Math.max(island.manifold.penetration - slop, 0) * percentCorrection).div(totalInvMass);

    const away = island.a.transform.position.sub(contact).normalized();
    const correctionAwayFromContact = away.dot(correction);

    if (correctionAwayFromContact >= 0) {
        return;
    }
    island.a.transform.position = island.a.transform.position.sub(correction.mul(aInvMass).mul(1));
    island.b.transform.position = island.b.transform.position.sub(correction.mul(bInvMass).mul(-1));
}