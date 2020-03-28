import { Engine } from "../engine";
import { tree } from "./collisionDetector";
import { AABB } from "../core/aabb";
import Vector2 from "../core/vector2";
import { destroyCircle } from "./collisionTextureManager";
import { Color } from "../core/color";
import { Collider } from "../components/collider";
import { liveParticles } from "./particleManager";
import { particlePool } from "../particles/particlePool";
import { basicEmitter } from "../particles/emitterFactory";

const emitter = basicEmitter();

export default (engine: Engine) => {
    const healthyColor = new Color(0, 0, 0);
    const deadColor = new Color(255, 255, 255);

    const getPower = (distance: number, radius: number, exponent: number = 1) => {
        // (1 - distance/radius)^exponent
        return (1 - distance / radius) ** exponent;
    }
    const applyExplosiveForce = (centre: Vector2, radius: number, force: number) => {
        const affected = tree.query(new AABB(centre, new Vector2(radius*2))).map(c => engine.getEntity(c.bodyId));

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
        }
    }

    // Handle coloring.
    engine.makeSystem('aliveForTime', 'explodes', 'collider')
        .onEach('tick', entity => {
            entity.collider.fillColor = Color.lerp(deadColor,
                healthyColor,
                entity.aliveForTime.remainingTime / entity.aliveForTime.time)
                .toHexString();
        });

    // Handle destruction.
    engine.makeSystem().onMessage('destroy', ({ entity }) => {
        const explodes = entity.get('explodes');
        const transform = entity.get('transform');
        if (!explodes || !transform)
            return;

        const rangeBounds = new AABB(transform.position, new Vector2(explodes.radius*2));
        const nearbyColliders = tree.query(rangeBounds);

        for (const near of nearbyColliders) {
            const entity = engine.getEntity(near.bodyId);
            const collisionTexture = entity.get('collisionTexture');
            if (!collisionTexture)
                continue;

            const removedPoints = destroyCircle(entity as any, transform.position, explodes.radius);
            for (const point of removedPoints) {
                const p = particlePool.get();
                p.color = 'green';
                p.emitter = emitter;
                p.positionX = point.x;
                p.positionY = point.y;

                const speed = 10
                const dist = point.distance(transform.position);
                const closeness = 1- dist/explodes.radius;

                const velocity = point.sub(transform.position).normalized().mul(closeness*speed + 1)
                p.velocityX = velocity.x;
                p.velocityY = velocity.y;
                const scale = 1.2;
                p.scaleX = collisionTexture.gridSize*scale;
                p.scaleY = collisionTexture.gridSize*scale;
                p.timeToLive = 5;
                p.rotation = 0;
                p.angularVelocity = (point.x <= transform.position.x ? -1 : 1) * 0.1 * closeness
                liveParticles.push(p)
            }
        }

        applyExplosiveForce(transform.position, explodes.radius, explodes.force);
    })
}