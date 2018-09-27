import Body from "../components/body";
import { Transform } from "../components/transform";
import { AABB } from "../core/aabb";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";

export default function addPhysics(engine: Engine) {
    engine.subscriber
        .on('tick')
        .allWith('body', 'transform')
        .subscribe(({ entities, message }) => {
            const step = message['step'];
            const components = entities.map(e => e.components);
            components
                .forEach(e1 => {
                    tryMoveOnAxis(e1, components, Vector2.unitY, step);
                    tryMoveOnAxis(e1, components, Vector2.unitX, step);
                })
        });
}

type Entity = { transform: Transform, body: Body };
const tryMoveOnAxis = (entity: Entity, entities: Entity[], axis: Vector2, step: number) => {
    const oldPos = entity.transform.position;
    const velocityAlongComponent = entity.body.velocity.mul(axis).round();

    entity.transform.position = entity.transform.position.add(velocityAlongComponent.mul(step));
    const e1B = new AABB(entity.transform.position, new Vector2(entity.body.width, entity.body.height));

    const collides = entities
        .some(e2 => {
            if (entity == e2) {
                return false;
            }

            const e2B = new AABB(e2.transform.position, new Vector2(e2.body.width, e2.body.height));
            return e1B.intersects(e2B);
        });

    if (collides) {
        entity.transform.position = oldPos;
        entity.body.velocity = entity.body.velocity.sub(velocityAlongComponent);
    }
};