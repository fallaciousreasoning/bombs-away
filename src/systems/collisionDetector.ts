import { Manifold } from '../collision/manifold';
import { Pool } from "../core/pool";
import { Engine } from "../engine";
import { Collision, Trigger } from "../messages/collision";
import solve from './collisionResolver';
import { Entityish } from "./system";
import { dynamicFixtures, dynamicEntities, otherFixtures } from './fixtureManager';
import { Fixture } from '../collision/fixture';
import Vector2 from '../core/vector2';

export interface Island {
    a: Entityish<['collider', 'transform']>;
    b: Entityish<['collider', 'transform']>;

    isNew: boolean;

    manifolds: Manifold[];
    hash: number;
}

const hash = (a: { bodyId: number }, b: { bodyId: number }) => {
    const min = Math.min(a.bodyId, b.bodyId);
    const max = Math.max(a.bodyId, b.bodyId);

    return (23 * 37 + min) * 37 + max;
}

class CollisionManager {
    private engine: Engine;
    private islands: Map<number, Island> = new Map();
    private message: Collision = {} as any;

    constructor(engine: Engine) {
        this.engine = engine;
    }

    reflexiveMessageBroadcast(messageType: string, island: Island) {
        // TODO: Oh god really not this.
        const manifold = island.manifolds[0] || {
            contacts: [],
            normal: Vector2.zero,
            penetration: 0
        };

        this.message.type = messageType as any;
        this.message.contacts = manifold.contacts;
        this.message.elasticity = Math.min(island.a.collider.elasticity, island.b.collider.elasticity);
        // Friction is sqrt(a^2 + b^2)
        this.message.friction = Math.sqrt(island.a.collider.friction * island.a.collider.friction + island.b.collider.friction * island.b.collider.friction);
        this.message.penetration = manifold.penetration;

        this.message.moved = island.b;
        this.message.hit = island.a;
        this.message.normal = manifold.normal.negate();
        this.engine.broadcastMessage(this.message);

        this.message.hit = island.b;
        this.message.moved = island.a;
        this.message.normal = manifold.normal;

        this.engine.broadcastMessage(this.message);
    }

    getIslands() {
        return this.islands.values();
    }

    run(a: Fixture, b: Fixture): Collision | Trigger {
        const aVertices = a.transformedVertices;
        const bVertices = b.transformedVertices;

        // See if we have an existing collision.
        const h = hash(a, b);
        let island = this.islands.get(h);

        // This is the second time we've seen this island, so it isn't new anymore.
        if (island) {
            island.isNew = false;
        }

        const manifold = new Manifold(aVertices, bVertices);

        // Is there is no penetration, there is no collision.
        if (manifold.penetration === 0)
            return;

        // If there is no island, make a new one.
        if (!island) {
            island = {
                a: this.engine.getEntity(a.bodyId) as any,
                b: this.engine.getEntity(b.bodyId) as any,
                hash: h,
                isNew: true,
                manifolds: []
            };
            this.islands.set(island.hash, island);
        }

        // Record this collision.
        island.manifolds.push(manifold);

        // Don't try and solve trigger collisions.
        if (island.a.collider.isTrigger || island.b.collider.isTrigger) return;

        // Solve the collision.
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

            for (const island of collisionManager.getIslands()) {
                const isTrigger = island.a.collider.isTrigger || island.b.collider.isTrigger;
                const messageType = isTrigger ? 'trigger' : 'collision';

                if (island.isNew)
                    collisionManager.reflexiveMessageBroadcast(messageType + '-enter', island);
                else if (island.manifolds.length === 0)
                    collisionManager.reflexiveMessageBroadcast(messageType + '-exit', island);
                else
                    collisionManager.reflexiveMessageBroadcast(messageType, island);

                island.manifolds = [];
            }
        });
}