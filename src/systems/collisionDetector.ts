import { CollisionManager } from '../collision/collisionManager';
import { Fixture } from '../collision/fixture';
import { Engine } from "../engine";
import { context } from '../game';
import { AABBTree } from '../geometry/dynamicAabbTree';
import { METRES_A_PIXEL, useGameView } from './addRenderer';
import solve from './collisionResolver';
import { dynamicEntities, dynamicFixtures, fixtures, triggerFixtures } from './fixtureManager';

export const tree = new AABBTree<Fixture>();
window['tree'] = tree;

export default function addPhysics(engine: Engine) {
    const collisionManager = new CollisionManager(engine);

    // Add entities we missed instantiate messages for...
    for (const f of fixtures())
        tree.add(f);

    engine
        .makeSystem('collider')
        .onTargetedMessage('instantiate', ({ entity }) => {
            entity.collider.tree = tree;
            entity.collider.fixtures.forEach(f => tree.add(f));
        })
        .onMessage('tick', message => {
            const steps = 10;
            const step = message.step / steps;

            for (let _ = 0; _ < steps; ++_) {
                collisionManager.resetManifolds();

                // Move the dynamic entities.
                for (const { body, transform } of dynamicEntities()) {
                    const movedAmount = body.velocity.mul(step);
                    transform.position = transform.position.add(movedAmount);
                    transform.rotation += body.angularVelocity * step;
                }

                // Update collider positions in tree.
                tree.update();

                for (const dynamicFixture of dynamicFixtures()) {
                    const nearby = tree.query(dynamicFixture.bounds);
                    for (const fixture of nearby) {
                        if (fixture.bodyId === dynamicFixture.bodyId)
                            continue;

                        collisionManager.run(dynamicFixture, fixture);
                    }
                }

                for (const triggerFixture of triggerFixtures()) {
                    const nearby = tree.query(triggerFixture.bounds);
                    for (const fixture of nearby) {
                        if (fixture.bodyId === triggerFixture.bodyId) continue;

                        collisionManager.run(triggerFixture, fixture);
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

            collisionManager.cleanupIslands();
        });

    // Render AABBTree
    const treeNodeColors = ['red', 'green', 'blue', 'cornflourblue', 'orange'];
    engine.makeSystem()
        .onMessage('tick', () => {
            // TODO: Make it possible to turn AABB tree on and off.
            if (!false) return;

            useGameView();

            for (const node of tree) {
                const color = treeNodeColors[node.id % treeNodeColors.length];
                context.strokeStyle = color;
                context.lineWidth = METRES_A_PIXEL;
                context.strokeRect(node.bounds.min.x, node.bounds.min.y, node.bounds.width, node.bounds.height);
            }
        });

    // Clean up fixtures when their entities are destroyed.
    engine.makeSystem('collider')
        .onTargetedMessage('destroy', ({ entity }) => {
            entity.collider.fixtures.forEach(f => tree.remove(f));
        })
}