import { Manifold } from '../collision/manifold';
import { Pool } from "../core/pool";
import { Engine } from "../engine";
import { Collision, Trigger } from "../messages/collision";
import solve from './collisionResolver';
import { Entityish } from "./system";
import { dynamicFixtures, dynamicEntities, otherFixtures } from './fixtureManager';


export interface Island {
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

        // Don't try and solve trigger collisions.
        if (island.a.collider.isTrigger || island.b.collider.isTrigger) return;

        solve(island);
    }
}

export default function addPhysics(engine: Engine) {
    const collisionManager = new CollisionManager(engine);
    engine
        .makeSystem()
        .onMessage('tick', message => {
            const steps = 1;
            const step = message.step / steps;
            for (let _ = 0; _ < steps; ++_) {
                // Move the dynamic entities.
                for (const { body, transform } of dynamicEntities()) {
                    const movedAmount = body.velocity.mul(step);
                    transform.position = transform.position.add(movedAmount);
                    transform.rotation += body.angularVelocity * step;
                }

                for (const dynamicFixture of dynamicFixtures())
                    for (const fixture of otherFixtures(dynamicFixture))
                        collisionManager.run(dynamicFixture, fixture);
            }
        });
}