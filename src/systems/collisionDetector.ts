import { Pool } from "../core/pool";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";
import { Collision, Trigger } from "../messages/collision";
import { Entityish } from "./system";
import { Manifold } from '../collision/manifold';
import { Entity } from "../entity";

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

    collides(a: Entityish<['collider', 'transform']>, b: Entityish<['collider', 'transform']>): Collision | Trigger {
        const aVertices = a.collider.vertices
            .rotate(a.transform.rotation)
            .translate(a.transform.position);

        const bVertices = b.collider.vertices
            .rotate(b.transform.rotation)
            .translate(b.transform.position);
        
        // See if we have an existing collision.
        const h = hash(a, b);
        let message = this.islands.get(h);

        const manifold = new Manifold(aVertices, bVertices);

        // TODO what about resting on the edge?

        if (manifold.penetration === 0) {
            this.onNoCollision(message);
            return;
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
        message.normal = manifold.normal;
        message.penetration = manifold.penetration;
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
    const collidable = engine.getFamily('collider', 'transform').entities;

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
                for (let j = 0; j < collidable.length; ++j) {
                    const b = collidable[j] as Entityish<['transform', 'collider']>;
                    if (a.id == b.id) continue;

                    // TODO: Work out what collision method to use.
                    const message = collisionManager.collides(a, b);
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