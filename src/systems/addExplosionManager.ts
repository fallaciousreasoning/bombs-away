import { Engine } from "../engine";
import { tree } from "./collisionDetector";
import { AABB } from "../core/aabb";
import Vector2 from "../core/vector2";
import { destroyCircle } from "./collisionTextureManager";
import { Color } from "../core/color";
import { Collider } from "../components/collider";

export default (engine: Engine) => {
    const healthyColor = new Color(0, 0, 0);
    const deadColor = new Color(255, 255, 255);

    const getPower = (distance: number, radius: number, exponent: number = 2) => {
        // (1 - distance/radius)^exponent
        return (1 - distance / radius) ** exponent;
    }
    const applyExplosiveForce = (centre: Vector2, radius: number, force: number) => {
        const affected = tree.query(new AABB(centre, new Vector2(radius))).map(c => engine.getEntity(c.bodyId));

        for (const entity of affected) {
            const transform = entity.get('transform');
            const collider = entity.get('collider');
            const body = entity.get('body');

            if (!transform || !body || !collider)
                continue;

            if (!body.isDynamic)
                continue;

            const distance = transform.position.distance(centre);
            if (distance > radius)
                continue;

            const dir = transform.position.sub(centre).normalized();
            const impulse = dir.mul(force).mul(getPower(distance, radius));
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

        const rangeBounds = new AABB(transform.position, new Vector2(explodes.radius));
        const nearbyColliders = tree.query(rangeBounds);

        for (const near of nearbyColliders) {
            const entity = engine.getEntity(near.bodyId);
            const collisionTexture = entity.get('collisionTexture');
            if (!collisionTexture)
                continue;

            destroyCircle(entity as any, transform.position, explodes.radius);
        }

        applyExplosiveForce(transform.position, explodes.radius, explodes.force);
    })
}