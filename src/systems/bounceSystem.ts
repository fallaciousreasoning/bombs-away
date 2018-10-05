import { Engine } from "../engine";

export default function addBounce(engine: Engine) {
    engine
        .makeSystem().onMessage('collision', ({ moved }) => {
            const bounce = moved.get('bounce');
            if (!bounce) return;

            if (bounce.y)
                moved.body.velocity = moved.body.velocity.withY(-moved.body.velocity.y * bounce.bounciness);
            if (bounce.x)
                moved.body.velocity = moved.body.velocity.withX(-moved.body.velocity.x * bounce.bounciness);
        });
}