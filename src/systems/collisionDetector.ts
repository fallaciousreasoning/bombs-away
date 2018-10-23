import { Pool } from "../core/pool";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";
import { Collision, Trigger } from "../messages/collision";
import { Entityish } from "./system";

type CollisionEntity = Entityish<['body', 'transform', 'collider']>;

const hash = (a: {id: number}, b: {id: number}) => {
    const min = Math.min(a.id, b.id);
    const max = Math.max(a.id, b.id);

    return (23 * 37 + min) * 37 + max;
}

class CollisionManager {
    private islandPool = new Pool<Collision | Trigger>(() => ({
        type: 'collision',
        hit: undefined,
        moved: undefined,
        movedAmount: undefined,
        normal: undefined,
        penetration: 0,
        hash: undefined
    }), (i) => {
        // Reset the type.
        i.type = "collision";
    });

    private engine: Engine;
    private islands: Map<number, Collision | Trigger> = new Map();

    constructor(engine: Engine) {
        this.engine = engine;
    }

    onNoCollision(message: Collision | Trigger) {
        // If there was no existing collision, return.
        if (!message) {
            return;
        }

        // Otherwise, we've separated.
        // Hacky set type, so we don't thrash the GC. Reset by the pool.
        (<any>message)['type'] = message.type == 'collision'
            ? 'collision-exit'
            : 'collision-enter'; 
        this.engine.broadcastMessage(message);

        // Clean up.
        this.islands.delete(message.hash);
        this.islandPool.release(message);
    }

    collidesRectangleRectangle(a: Entityish<['collider', 'transform']>, b: Entityish<['collider', 'transform']>): Collision | Trigger {
        const aToB = b.transform.position.sub(a.transform.position);
        const xOverlap = (a.collider.width + b.collider.width) / 2 - Math.abs(aToB.x);

        // See if we have an existing collision.
        const h = hash(a, b);
        let message = this.islands.get(h);

        if (xOverlap < 0) {
            this.onNoCollision(message);
            return;
        }

        const yOverlap = (a.collider.height + b.collider.height) / 2 - Math.abs(aToB.y);

        if (yOverlap < 0) {
            this.onNoCollision(message);
            return;
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

        // If we don't have an existing collision.
        if (!message) {
            message = this.islandPool.get();
            message.hash = h;

            (<any>message).type = false //a.body.isTrigger || b.body.isTrigger
                ? "trigger-enter"
                : "collision-enter";
        }

        // TODO: Probably should cast a/b to any here.
        message.hit = <any>b;
        message.moved = <any>a;
        message.normal = normal;
        message.penetration = penetration;
        message.hash = h;
        this.islands.set(message.hash, message);

        if (<any>message.type === "collision-enter") {
            this.engine.broadcastMessage(message);
            (<any>message['type']) = "collision";
        }

        if (<any>message.type === "trigger-enter") {
            this.engine.broadcastMessage(message);
            (<any>message['type']) = "trigger";
        }

        return message;
    }
}

export default function addPhysics(engine: Engine) {
    const collisionManager = new CollisionManager(engine);

    engine
        .makeSystem('body', 'collider', 'transform')
        .on('tick', (entities, message) => {
            // TODO: Loop should go over all entities with collider + transform, not just ones with bodies

            // Outer loop over all dynamic bodies.
            for (let i = 0; i < entities.length; ++i) {
                const a = entities[i];
                const body = a.get('body');

                // Can't update entity with no body.
                if (!body) {
                    continue;
                }

                // Move the entity.
                const movedAmount = body.velocity.mul(message.step);
                a.transform.position = a.transform.position.add(movedAmount);

                if (!body.isDynamic) continue;

                // Inner loop over all other bodies.
                for (let j = 0; j < entities.length; ++j) {
                    if (i == j) continue;

                    const b = entities[j];

                    // TODO: Work out what collision method to use.
                    const message = collisionManager.collidesRectangleRectangle(a, b);
                    if (!message) {
                        continue;
                    }

                    // TODO: Move this in with all the other messages.
                    message.movedAmount = movedAmount;
                    engine.broadcastMessage(message);
                }
            }
        });
}