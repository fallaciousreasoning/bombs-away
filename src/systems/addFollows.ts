import { Engine } from "../engine";
import Input from "../core/input";
import Vector2 from "../core/vector2";

export default (engine: Engine, input: Input) => {
    engine.makeSystem('stayOnMouse', 'transform')
        .onEach('tick', ({ transform }) => {
            transform.position = input.mousePosition;
        });

    engine.makeSystem('followTransform', 'transform')
        .onEach('tick', ({ transform, followTransform }, message) => {
            transform.position = Vector2.lerp(transform.position,
                followTransform.follow.position,
                followTransform.spring * message.step);
        })
}