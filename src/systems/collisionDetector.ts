import { Pool } from "../core/pool";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";
import { Collision, Trigger } from "../messages/collision";
import { Entityish } from "./system";
import { Manifold } from '../collision/manifold';
import { Entity } from "../entity";

interface Island {
    a: Entityish<['collider', 'transform']>;
    b: Entityish<['collider', 'transform']>;

    manifold: Manifold;
    type: 'trigger' | 'collision';
    hash: number;
}

const hash = (a: { id: number }, b: { id: number }) => {
    const min = Math.min(a.id, b.id);
    const max = Math.max(a.id, b.id);

    return (23 * 37 + min) * 37 + max;
}

class CollisionManager {
    private islandPool = new Pool<Island>(() => ({
        a: undefined,
        b: undefined,
        manifold: undefined,
        hash: undefined,
        type: 'collision'
    }), (i) => {
        i.type = 'collision';
    });

    private engine: Engine;
    private islands: Map<number, Island> = new Map();
    private message: Collision = {} as any;

    constructor(engine: Engine) {
        this.engine = engine;
    }

    private reflexiveMessageBroadcast(type: string, island: Island) {
        this.message.type = type as any;
        this.message.hit = island.a;
        this.message.moved = island.b;
        // TODO: Actually get contacts, this isn't accurate for edge/edge collisions :'(
        this.message.contacts = island.manifold.contacts;
        this.message.elasticity = Math.min(island.a.collider.elasticity, island.b.collider.elasticity);
        // Friction is sqrt(a^2 + b^2)
        this.message.friction = Math.sqrt(island.a.collider.friction * island.a.collider.friction + island.b.collider.friction * island.b.collider.friction);
        this.message.normal = island.manifold.normal.negate();
        this.message.penetration = island.manifold.penetration;
        this.engine.broadcastMessage(this.message);

        this.message.hit = island.b;
        this.message.moved = island.a;
        this.message.normal = island.manifold.normal;
        this.engine.broadcastMessage(this.message);
    }

    onNoCollision(island: Island) {
        // If there was no existing collision, return.
        if (!island) {
            return;
        }

        // Otherwise, we've separated.
        const type = island.a.collider.isTrigger || island.b.collider.isTrigger
            ? 'collision-exit'
            : 'trigger-exit';
        this.reflexiveMessageBroadcast(type, island);

        // Clean up.
        this.islands.delete(island.hash);
        this.islandPool.release(island);
    }

    run(a: Entityish<['collider', 'transform']>, b: Entityish<['collider', 'transform']>): Collision | Trigger {
        const aVertices = a.collider.vertices
            .rotate(a.transform.rotation)
            .translate(a.transform.position);

        const bVertices = b.collider.vertices
            .rotate(b.transform.rotation)
            .translate(b.transform.position);

        // See if we have an existing collision.
        const h = hash(a, b);
        let island = this.islands.get(h);

        const manifold = new Manifold(aVertices, bVertices);

        // TODO what about resting on the edge?

        if (manifold.penetration === 0) {
            this.onNoCollision(island);
            return;
        }

        const isTrigger = a.collider.isTrigger || b.collider.isTrigger;
        const entered = !island;

        // If we don't have an existing collision.
        if (!island) {
            island = this.islandPool.get();
            island.hash = h;
            island.a = a;
            island.b = b;

            this.islands.set(island.hash, island);
        }

        island.manifold = manifold;

        if (entered) {
            this.reflexiveMessageBroadcast(isTrigger
                ? 'trigger-enter'
                : 'collision-enter', island);
        }

        this.reflexiveMessageBroadcast(isTrigger
            ? 'trigger'
            : 'collision', island);
    }
}

export default function addPhysics(engine: Engine) {
    const collisionManager = new CollisionManager(engine);
    const collidable = engine.getFamily('collider', 'transform').entities;

    engine
        .makeSystem('body', 'collider', 'transform')
        .on('tick', (entities, message) => {
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
                a.transform.rotation += body.angularVelocity * message.step;

                if (!body.isDynamic) continue;

                // Inner loop over all other bodies.
                for (let j = 0; j < collidable.length; ++j) {
                    const b = collidable[j] as Entityish<['transform', 'collider']>;
                    if (a.id == b.id) continue;

                    collisionManager.run(a, b);
                }
            }
        });
}