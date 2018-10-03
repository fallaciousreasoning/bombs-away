import Input from "../core/input";
import { Engine } from "../engine";

export default function addLookAtMouse(input: Input, engine: Engine) {
    engine
    .makeSystem('lookAtMouse', 'transform')
    .onEach('tick', ({ transform }) => {
        transform.rotation = input.mousePosition.sub(transform.position).toDegrees();
    });
}