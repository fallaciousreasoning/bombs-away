import { hasTag, Tag } from "../components/tag";
import { Transform } from "../components/transform";
import { Engine } from "../engine";
import { Entity } from "../entity";
import { convexPartition } from "../geometry/bayazitDecomposer";
import { subtract } from "../geometry/subtract";

export const deformTerrain = (engine: Engine) => {
    engine.makeSystem()
        .onMessage('collision-enter', island => {
            const isCutty = hasTag(island.moved, 'deforms');
            const isCuttable = hasTag(island.hit, 'terrain');

            if (!isCutty || !isCuttable) {
                return;
            }

            // Remove the cutty entity.
            engine.removeEntity(island.moved);
            engine.removeEntity(island.hit)

            const removeShape = island.moved.collider.vertices.translate(island.moved.transform.position);
            const fromShape = island.hit.collider.vertices.translate(island.hit.transform.position);

            const subtracted = subtract(fromShape, removeShape);
            const decomposed = convexPartition(subtracted);

            // For now, we can only deal with one bit.
            
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