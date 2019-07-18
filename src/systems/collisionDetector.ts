import { Manifold } from '../collision/manifold';
import { Pool } from "../core/pool";
import { Engine } from "../engine";
import { Collision, Trigger } from "../messages/collision";
import solve from './collisionResolver';
import { Entityish } from "./system";
import { dynamicFixtures, dynamicEntities, otherFixtures, fixtures } from './fixtureManager';
import { Fixture } from '../collision/fixture';
import Vector2 from '../core/vector2';
import { stableHashPair } from '../core/hashHelper'
import { AABBTree } from '../geometry/dynamicAabbTree';
import { CollisionManager } from '../collision/collisionManager';

export default function addPhysics(engine: Engine) {
    const collisionManager = new CollisionManager(engine);
    engine
        .makeSystem()
        .onMessage('tick', message => {
            const steps = 1;
            const step = message.step / steps;

            // Make a tree of all fixtures.
            const tree = new AABBTree<Fixture>();
            const fs = Array.from(fixtures());
            for (const fixture of fs) {
                tree.add(fixture);
            }

            for (let _ = 0; _ < steps; ++_) {
                collisionManager.resetIslands();

                // Move the dynamic entities.
                for (const { body, transform } of dynamicEntities()) {
                    const movedAmount = body.velocity.mul(step);
                    transform.position = transform.position.add(movedAmount);
                    transform.rotation += body.angularVelocity * step;
                }

                for (const dynamicFixture of dynamicFixtures()) {
                    const nearby = tree.query(dynamicFixture.bounds);
                    for (const fixture of nearby) {
                        if (fixture.bodyId === dynamicFixture.bodyId)
                          continue;

                        collisionManager.run(dynamicFixture, fixture);
                    }
                }

                // Solve non-triggers.
                for (const island of collisionManager.getIslands()) {
                    // Don't solve trigger collisions.
                    const isTrigger = island.a.collider.isTrigger || island.b.collider.isTrigger;
                    if (!isTrigger)
                        solve(island);
                }
            }

            for (const island of collisionManager.getIslands()) {
                // Don't solve trigger collisions.
                const isTrigger = island.a.collider.isTrigger || island.b.collider.isTrigger;
                
                const messageType = isTrigger ? 'trigger' : 'collision';

                if (island.isNew)
                    collisionManager.reflexiveMessageBroadcast(messageType + '-enter', island);
                
                collisionManager.reflexiveMessageBroadcast(messageType, island);                  
                
                if (island.manifolds.length === 0)
                    collisionManager.reflexiveMessageBroadcast(messageType + '-exit', island);

                island.isNew = false;
            }
        });
}