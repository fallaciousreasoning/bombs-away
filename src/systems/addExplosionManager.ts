import { Engine } from "../engine";
import { tree } from "./collisionDetector";
import { AABB } from "../core/aabb";
import Vector2 from "../core/vector2";
import { destroyCircle } from "./collisionTextureManager";
import { Color } from "../core/color";

export default (engine: Engine) => {
    const healthyColor = new Color(0, 0, 0);
    const deadColor = new Color(255, 255, 255);

    // Handle coloring.
    engine.makeSystem('aliveForTime', 'explodes', 'collider')
        .onEach('tick', entity => {
        entity.collider.color = Color.lerp(deadColor, healthyColor, entity.aliveForTime.time / 5).toHexString();
        console.log(entity.collider.color);
    });

    // Handle destruction.
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