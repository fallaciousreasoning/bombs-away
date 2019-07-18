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
import { renderConfig, drawBox } from './colliderRenderer';

export default function addPhysics(engine: Engine) {
    const collisionManager = new CollisionManager(engine);
    const tree = new AABBTree<Fixture>();
    setTimeout(() => {
        for (const f of fixtures())
          tree.add(f);
    })

    engine
        .makeSystem()
        .onMessage('tick', message => {
            const steps = 1;
            const step = message.step / steps;

            for (let _ = 0; _ < steps; ++_) {
                tree.update();
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

    // Render AABBTree
    const treeNodeColors = ['red', 'green', 'blue', 'cornflourblue', 'orange'];
    engine.makeSystem()
        .onMessage('tick', () => {
            if (!renderConfig.drawAABBTree) return;

            for (const node of tree) {
                const color = treeNodeColors[node.id % treeNodeColors.length];
                drawBox(node.bounds.centre, node.bounds.width, node.bounds.height, color, true);
            }
        });
}