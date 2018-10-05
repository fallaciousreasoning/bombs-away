import Vector2 from "../core/vector2";
import { Engine } from "../engine";
import { Collision } from "../messages/collision";

const collisionMessage: Collision = { type: 'collision' } as any;

export default function addPhysics(engine: Engine) {
    engine
        .makeSystem('body', 'transform')
        .on('tick', (entities, message) => {
            // Outer loop over all dynamic bodies.
            for (let i = 0; i < entities.length; ++i) {
                const a = entities[i];

                // Move the entity.
                const movedAmount = a.body.velocity.mul(message.step);
                a.transform.position = a.transform.position.add(movedAmount);

                if (!a.body.isDynamic) continue;

                // Inner loop over all other bodies.
                for (let j = 0; j < entities.length; ++j) {
                    if (i == j) continue;

                    const b = entities[j];

                    const aToB = b.transform.position.sub(a.transform.position);
                    const xOverlap = (a.body.width + b.body.width)/2 - Math.abs(aToB.x);

                    if (xOverlap < 0) {
                        continue;
                    }

                    const yOverlap = (a.body.height + b.body.height)/2 - Math.abs(aToB.y);

                    if (yOverlap < 0) {
                        continue;
                    }

                    let normal: Vector2;
                    let penetration: number;
                    if (xOverlap < yOverlap) {
                        normal = new Vector2(aToB.x < 0 ? -1 : 1, 0);
                        penetration = xOverlap;
                    } else {
                        normal = new Vector2(0, aToB.y < 0 ? -1 : 1);
                        penetration = yOverlap;
                    }

                    collisionMessage.hit = b;
                    collisionMessage.moved = a;
                    collisionMessage.movedAmount = movedAmount;
                    collisionMessage.normal = normal;
                    collisionMessage.penetration = penetration;
                    engine.broadcastMessage(collisionMessage);
                }
            }
        });
}

// const tryMoveOnAxis = (entity: Entity, entities: Entity[], axis: Vector2, step: number) => {
//     const oldPos = entity.transform.position;
//     const velocityAlongComponent = entity.body.velocity.mul(axis).round();

//     entity.transform.position = entity.transform.position.add(velocityAlongComponent.mul(step));
//     const e1B = new AABB(entity.transform.position, new Vector2(entity.body.width, entity.body.height));

//     const collides = entities
//         .some(e2 => {
//             if (entity == e2) {
//                 return false;
//             }

//             const e2B = new AABB(e2.transform.position, new Vector2(e2.body.width, e2.body.height));
//             return e1B.intersects(e2B);
//         });

//     if (collides) {
//         entity.transform.position = oldPos;
//         entity.body.velocity = entity.body.velocity.sub(velocityAlongComponent);
//     }
// };