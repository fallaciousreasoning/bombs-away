import { Transform } from "../components/transform";
import Input from "../core/input";
import { Engine } from "../engine";

export default function addFlipWithMouse(input: Input, engine: Engine) {
    engine.subscriber
    .on('tick')
    .with('flipWithMouse', 'transform')
    .map(e => e.components)
    .map(({ transform }: { transform: Transform }) => {
        if (input.mousePosition.x < transform.position.x && transform.localPosition.x > 0) {
            transform.localPosition = transform.localPosition.withX(-transform.localPosition.x);
        }

        if (input.mousePosition.x > transform.position.x && transform.localPosition.x < 0) {
            transform.localPosition = transform.localPosition.withX(-transform.localPosition.x);
        }
    });
}