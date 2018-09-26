import { AABB } from "../core/aabb";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";



export default function addPhysics(engine: Engine) {
    engine.subscriber
        .on('tick')
        .allWith('body', 'transform')
        .subscribe(({ entities, message }) => {
            const step = message['step'];
            entities.map(e => e.components)
                .forEach(e1 => {
                    const oldPos = e1.transform.position;

                    const e1B = new AABB(e1.transform.position, new Vector2(e1.body.width, e1.body.height));
                    e1.transform.position = e1.transform.position.add(e1.body.velocity.mul(step));

                    const collides = entities.map(e => e.components)
                        .some(e2 => {
                            if (e1 == e2) {
                                return false;
                            }

                            const e2B = new AABB(e2.transform.position, new Vector2(e2.body.width, e2.body.height));
                            return e1B.intersects(e2B);
                        });

                    if (collides) {
                        e1.transform.position = oldPos;
                        e1.body.velocity = Vector2.zero;
                    }
                })
        });
}