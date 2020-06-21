import { Engine } from "../engine";
import { tree } from "./collisionDetector";
import { AABB } from "../core/aabb";
import Vector2 from "../core/vector2";
import { destroyCircle, destroyBox } from "./collisionTextureManager";
import { Color } from "../core/color";
import { Collider } from "../components/collider";
import { liveParticles } from "./particleManager";
import { particlePool } from "../particles/particlePool";
import { basicEmitter } from "../particles/emitterFactory";

const vibrate = ('vibrate' in navigator)
    ? (amount: number) => navigator.vibrate(amount)
    : () => {};

const emitter = basicEmitter();

export default (engine: Engine) => {
    const getPower = (distance: number, radius: number, exponent: number = 1) => {
        // (1 - distance/radius)^exponent
        return (1 - distance / radius) ** exponent;
    }
    const applyExplosiveForce = (centre: Vector2, radius: number, force: number, damage?: number) => {
        const affected = tree.query(new AABB(centre, new Vector2(radius * 2))).map(c => engine.getEntity(c.bodyId));

        for (const entity of affected) {
            const transform = entity.get('transform');
            const collider = entity.get('collider');
            const body = entity.get('body');
            
            if (!transform || !body || !collider)
            continue;
            
            if (!body.isDynamic)
            continue;
            
            // Find the closest vertex.
            let minDistance = Number.MAX_SAFE_INTEGER;
            for (const vertex of collider.getTransformsVertices()) {
                const distance = vertex.distance(centre);
                if (distance < minDistance)
                minDistance = distance;
            }
            if (minDistance > radius)
            continue;
            
            const dir = transform.position.sub(centre).normalized();
            const impulse = dir.mul(force).mul(getPower(minDistance, radius));
            body.velocity = body.velocity.add(impulse);
            
            // Maybe damage things with health?
            if (entity.has('health') && minDistance < radius/2) {
                entity.health.health -= damage;
            }
        }
    }
    
    // Handle destruction.
    engine.makeSystem('explodes', 'transform')
        .onTargetedMessage('destroy', ({ entity }) => {
        const explodes = entity.explodes;
        const transform = entity.transform;

        const effectiveRadius = explodes.shape.type === 'circle'
            ? explodes.shape.radius
            : Math.sqrt(explodes.shape.width ** 2 + explodes.shape.height ** 2);

        const rangeBounds = explodes.shape.type === 'circle'
            ? new AABB(transform.position, new Vector2(explodes.shape.radius * 2))
            : new AABB(transform.position, new Vector2(explodes.shape.width, explodes.shape.height));

        const nearbyColliders = tree.query(rangeBounds);

        for (const near of nearbyColliders) {
            const entity = engine.getEntity(near.bodyId);
            const collisionTexture = entity.get('collisionTexture');
            if (!collisionTexture)
                continue;

            const removedPoints = explodes.shape.type === 'circle'
                ? destroyCircle(entity as any, transform.position, explodes.shape.radius)
                : destroyBox(entity as any, rangeBounds);

            for (const point of removedPoints) {
                const p = particlePool.get();
                p.color = 'green';
                p.emitter = emitter;
                p.positionX = point.x;
                p.positionY = point.y;

                const speed = 3
                const dist = point.distance(transform.position);
                const closeness = 1 - dist / effectiveRadius;

                const velocity = point.sub(transform.position).normalized().mul(closeness * speed + 1)
                p.velocityX = velocity.x;
                p.velocityY = velocity.y;
                const scale = 1.2;
                p.scaleX = collisionTexture.gridSize * scale;
                p.scaleY = collisionTexture.gridSize * scale;
                p.timeToLive = 5;
                p.rotation = 0;
                p.angularVelocity = (point.x <= transform.position.x ? -1 : 1) * 0.1 * closeness
                liveParticles.push(p)
            }
        }

        if (explodes.force !== 0) {
            applyExplosiveForce(transform.position,
                effectiveRadius,
                explodes.force,
                explodes.damage);

            vibrate(50);
        }
    })
}