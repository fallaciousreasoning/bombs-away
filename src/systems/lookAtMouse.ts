import { Transform } from "../components/transform";
import Input from "../core/input";
import { Engine } from "../engine";

export default function addLookAtMouse(input: Input, engine: Engine) {
    engine.subscriber
    .on('tick')
    .with('lookAtMouse', 'transform')
    .map(e => e.components)
    .map(({ transform }: { transform: Transform }) => {
        transform.rotation = input.mousePosition.sub(transform.position).toDegrees();
    });
}