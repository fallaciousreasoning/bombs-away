import { Engine } from "../engine";

export default function addPhysics(engine: Engine) {
    engine.subscriber
    .on('tick')
    .allWith('body', 'transform')
    .subscribe(({ entities, message }) => {
        const step = message['step'];
        entities.map(e => e.components)
            .forEach(e1 => {
                e1.transform.position = e1.transform.position.add(e1.body.velocity.mul(step));
            })
    });
}