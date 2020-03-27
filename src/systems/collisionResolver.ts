import Vector2 from "../core/vector2";
import { Entity } from "../entity";
import { Manifold } from "../collision/manifold";
import { Island } from "../collision/collisionManager";

const getMassData = (entity: Entity) => {
    const body = entity.get('body');
    if (!body) {
        return {
            mass: 0,
            invMass: 0,
            inertia: 0,
            invInertia: 0,
            area: 0
        }
    }
    
    const collider = entity.get('collider');
    return body.getMassData(collider.fixtures[0]);
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

function solveManifold(island: Island, manifold: Manifold) {
    const aBody = island.a.get('body');
    const bBody = island.b.get('body');

    const normal = manifold.normal;

    const contact = manifold.contacts
        .reduce((prev, next) => prev.add(next), Vector2.zero).div(manifold.contacts.length);

    const aVelocity = velocityAtPoint(island.a, contact);
    const bVelocity = velocityAtPoint(island.b, contact);

    let relativeVelocity = bVelocity.sub(aVelocity);
    const velocityAlongNormal = normal.dot(relativeVelocity);

    // If we're already moving apart, don't do anything.
    if (velocityAlongNormal >= 0)
        return;

    const aMassData = getMassData(island.a);
    const bMassData = getMassData(island.b);

    // Work out how we're going to hand out the collision response.
    const totalInvMass = aMassData.invMass + bMassData.invMass;
    const aInertiaDivisor = Math.pow(contact.sub(island.a.transform.position).cross(normal), 2) * aMassData.invInertia;
    const bInertiaDivisor = Math.pow(contact.sub(island.b.transform.position).cross(normal), 2) * bMassData.invInertia;

    const elasticity = Math.min(island.a.collider.elasticity, island.b.collider.elasticity);

    let magnitude = -(1 + elasticity) * velocityAlongNormal / (totalInvMass + aInertiaDivisor + bInertiaDivisor);
    magnitude /= manifold.contacts.length;

    let impulse = normal
        .mul(magnitude);

    for (const contact of manifold.contacts) {
        aBody && aBody.applyForce(impulse.mul(-1), contact.sub(island.a.transform.position), aMassData.invMass, aMassData.invInertia);
        bBody && bBody.applyForce(impulse, contact.sub(island.b.transform.position), bMassData.invMass, bMassData.invInertia);
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

    aBody && aBody.applyForce(frictionImpulse, contact.sub(island.a.transform.position), aMassData.invMass, aMassData.invInertia);
    bBody && bBody.applyForce(frictionImpulse.mul(-1), contact.sub(island.b.transform.position), bMassData.invMass, bMassData.invInertia);

    const slop = 0.01;
    const percentCorrection = 0.9;
    const correction = manifold.normal.mul(Math.max(manifold.penetration - slop, 0) * percentCorrection).div(totalInvMass);

    const away = island.a.transform.position.sub(contact).normalized();
    const correctionAwayFromContact = away.dot(correction);

    if (correctionAwayFromContact >= 0) {
        return;
    }
    island.a.transform.position = island.a.transform.position.sub(correction.mul(aMassData.invMass).mul(1));
    island.b.transform.position = island.b.transform.position.sub(correction.mul(bMassData.invMass).mul(-1));
}

export default function solve(island: Island) {
    for (const manifold of island.manifolds) {
        solveManifold(island, manifold);
    }
}