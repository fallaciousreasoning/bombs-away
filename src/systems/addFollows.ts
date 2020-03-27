import { Engine } from "../engine";
import Input from "../core/input";
import Vector2 from "../core/vector2";
import { input } from "../game";

export default (engine: Engine) => {
    engine.makeSystem('stayOnMouse', 'transform')
        .onEach('tick', ({ transform }) => {
            transform.position = input.mousePosition;
        });

    engine.makeSystem('followTransform', 'transform')
        .onEach('tick', ({ transform, followTransform }, message) => {
            let aimedPosition = followTransform.follow.get('transform').position;
            if (followTransform.offset)
                aimedPosition = aimedPosition.add(followTransform.offset);

            if (!isNaN(followTransform.spring)) {
                aimedPosition = transform.position.add(Vector2.lerp(transform.position,
                    aimedPosition,
                    followTransform.spring * message.step));
            }

            if (followTransform.lockX)
                aimedPosition = aimedPosition.withX(transform.position.x);

            if (followTransform.lockY)
                aimedPosition = aimedPosition.withY(transform.position.y);

            transform.position = aimedPosition;
        })
}