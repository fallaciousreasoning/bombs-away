import Body from '../components/body';
import Vector2 from '../core/vector2';
import { Engine } from "../engine";

export default function addGravity(engine: Engine, gravity: Vector2 = new Vector2(0, 10)) {
    engine.subscriber
    .on('tick')
    .with('body')
    .subscribe(result => {
      const body: Body = result.components.body; 
      
      if (!body.isDynamic) {
        return;
      }

      body.velocity = body.velocity.add(gravity.mul((result.message as any).step));
    });
}