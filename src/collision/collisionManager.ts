import { Manifold } from './manifold';
import { Entityish } from '../systems/system';
import { stableHashPair } from '../core/hashHelper';
import { Collision, Trigger } from '../messages/collision';
import { Engine } from '../engine';
import Vector2 from '../core/vector2';
import { Fixture } from './fixture';

export interface Island {
    a: Entityish<['collider', 'transform']>;
    b: Entityish<['collider', 'transform']>;

    isNew: boolean;

    manifolds: Manifold[];
    seenManifolds: Set<number>;

    hash: number;
}

const hash = (a: { bodyId: number }, b: { bodyId: number }) => {
    return stableHashPair(a.bodyId, b.bodyId);
}

export class CollisionManager {
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

        this.message.entity = island.b;
        this.message.hit = island.a;
        this.message.normal = manifold.normal.negate();
        this.engine.broadcastMessage(this.message);

        this.message.hit = island.b;
        this.message.entity = island.a;
        this.message.normal = manifold.normal;

        this.engine.broadcastMessage(this.message);
    }

    getIslands() {
        return this.islands.values();
    }

    resetManifolds() {
        // Reset all islands.
        for (const island of this.getIslands()) {
            island.manifolds.length = 0;
            island.seenManifolds.clear();
        }
    }

    cleanupIslands() {
        // Remove islands with no contact last tick.
        for (const island of this.getIslands()) {
            if (island.manifolds.length === 0)
             this.islands.delete(island.hash);
        }
    }

    run(a: Fixture, b: Fixture): Collision | Trigger {
        // See if we have an existing collision.
        const h = hash(a, b);
        let island = this.islands.get(h);
        const manifoldHash = Manifold.hashCodeOf(a, b);

        // If we've got a manifold for B/A don't add one for A/B
        if (island && island.seenManifolds.has(manifoldHash))
            return;

        // Don't compute the manifold unless we have to.
        const manifold = new Manifold(a, b);

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
                manifolds: [],
                seenManifolds: new Set()
            };
            this.islands.set(island.hash, island);
        }

        // Record this collision.
        island.manifolds.push(manifold);
        island.seenManifolds.add(manifoldHash);
    }
}