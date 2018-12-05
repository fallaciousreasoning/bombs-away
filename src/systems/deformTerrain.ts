import { hasTag, Tag } from "../components/tag";
import { Transform } from "../components/transform";
import { Engine } from "../engine";
import { Entity } from "../entity";
import { convexPartition } from "../geometry/bayazitDecomposer";
import { difference } from "../geometry/polyboolSubtract";

export const deformTerrain = (engine: Engine) => {
    engine.makeSystem()
        .onMessage('trigger-enter', island => {
            const isCutty = hasTag(island.moved, 'deforms');
            const isCuttable = hasTag(island.hit, 'terrain');

            if (!isCutty || !isCuttable) {
                return;
            }

            // Remove the cutty entity.
            const health = island.moved.get('health');
            if (health) {
                health.health = 0;
            }
            engine.removeEntity(island.hit)

            const removeShape = island.moved.collider.vertices.translate(island.moved.transform.position);
            const fromShape = island.hit.collider.vertices.translate(island.hit.transform.position);

            const diffed = difference(fromShape, removeShape);
            const decomposed = diffed.reduce((prev, next) => [...prev, ...convexPartition(next)], []);

            
            for (const vertices of decomposed) {
                let centroid = vertices.centroid;

                const entity = new Entity();
                entity.add(new Tag('terrain'));
                entity.add({ ...island.hit.collider, vertices: vertices.translate(centroid.negate()) });
                entity.add(new Transform(centroid));
                engine.addEntity(entity);
            }
        });
}