import { hasTag } from "../components/tag";
import { Engine } from "../engine";
import { convexPartition } from "../geometry/bayazitDecomposer";
import { subtract } from "../geometry/subtract";

export const deformTerrain = (engine: Engine) => {
    engine.makeSystem()
        .onMessage('trigger-enter', island => {
            const isCutty = hasTag(island.moved, 'cutty');
            const isCuttable = hasTag(island.hit, 'cuttable');

            if (!isCutty || !isCuttable) {
                return;
            }

            // Remove the cutty entity.
            engine.removeEntity(island.moved);

            const removeShape = island.moved.collider.vertices.translate(island.moved.transform.position);
            const fromShape = island.hit.collider.vertices.translate(island.hit.transform.position);

            const subtracted = subtract(fromShape, removeShape);
            const decomposed = convexPartition(subtracted);

            // For now, we can only deal with one bit.
            island.hit.collider.vertices = decomposed[0].translate(island.hit.transform.position);
        });
}