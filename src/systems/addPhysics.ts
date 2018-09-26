import Body from '../components/body';
import { Transform } from '../components/transform';
import { Engine } from "../engine";

export default function addPhysics(engine: Engine) {
    engine.subscriber
    .on('tick')
    .with('body', 'transform')
    .map(e => e.components)
    .subscribe(({ body, transform }: { body: Body, transform: Transform }) => {
        // TODO: Refactor this when I refactor systems
        transform.position = transform.position.add(body.velocity.mul(1/60));
    })
}