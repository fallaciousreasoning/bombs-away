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
            let nextPosition = transform.position.add(Vector2.lerp(transform.position,
                followTransform.follow.get('transform').position,
                followTransform.spring * message.step));

            if (followTransform.lockX)
              nextPosition = nextPosition.withX(transform.position.x);

            if (followTransform.lockY)
              nextPosition = nextPosition.withY(transform.position.y);

            transform.position = nextPosition;
        })
}