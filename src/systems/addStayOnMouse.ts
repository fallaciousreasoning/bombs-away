import { Engine } from "../engine";
import Input from "../core/input";

export default (engine: Engine, input: Input) => {
    engine.makeSystem('stayOnMouse', 'transform')
        .onEach('tick', ({ transform }) => {
            transform.position = input.mousePosition;
        });
}