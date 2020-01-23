import { Engine } from "../engine";
import { tree } from "./collisionDetector";
import { AABB } from "../core/aabb";
import Vector2 from "../core/vector2";
import { destroyCircle } from "./collisionTextureManager";

export default (engine: Engine) => {
    engine.makeSystem().onMessage('destroy', ({ entity }) => {
        const explodes = entity.get('explodes');
        const transform = entity.get('transform');
        if (!explodes || !transform)
          return;

        const rangeBounds = new AABB(transform.position, new Vector2(explodes.radius));
        const nearbyColliders = tree.query(rangeBounds);

        for (const near of nearbyColliders) {
            const entity = engine.getEntity(near.bodyId);
            const collisionTexture = entity.get('collisionTexture');
            if (!collisionTexture)
              continue;

            destroyCircle(entity as any, transform.position, explodes.radius);
        }
    })
}