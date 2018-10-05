import { Engine } from "../engine";

export default function addBounce(engine: Engine) {
    engine
      .makeSystem().onMessage('collision', ({ moved }) => {      
        const bounce = moved.get('bounce');
        moved.body.velocity = moved.body.velocity.mul(-1 * bounce.bounciness);
      });
}