import Vector2 from '../core/vector2';
import { Engine } from "../engine";

export default function addGravity(engine: Engine, gravity: Vector2 = new Vector2(0, 10)) {
    engine
      .makeSystem('body')
      .onEach('tick', ({ body }, message) => {      
        if (!body.isDynamic) {
          return;
        }
  
        body.velocity = body.velocity.add(gravity.mul(message['step']));
      });
}