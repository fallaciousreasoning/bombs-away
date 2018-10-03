import Input from "../core/input";
import { Engine } from "../engine";

export default function addFlipWithMouse(input: Input, engine: Engine) {
    engine
        .makeSystem('flipWithMouse', 'transform')
        .onEach('tick', ({ transform }) => {
            if (input.mousePosition.x < transform.position.x && transform.localPosition.x > 0) {
                transform.localPosition = transform.localPosition.withX(-transform.localPosition.x);
            }

            if (input.mousePosition.x > transform.position.x && transform.localPosition.x < 0) {
                transform.localPosition = transform.localPosition.withX(-transform.localPosition.x);
            }
        });
}