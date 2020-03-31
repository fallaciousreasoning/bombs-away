import { Engine } from "../engine";

export default function addBounce(engine: Engine) {
    engine
        .makeSystem().onMessage('collision', ({ entity: moved }) => {
            const bounce = moved.get('bounce');
            const body = moved.get('body');
            if (!bounce || !body) return;

            if (bounce.y)
                body.velocity = body.velocity.withY(-body.velocity.y * bounce.bounciness);
            if (bounce.x)
                body.velocity = body.velocity.withX(-body.velocity.x * bounce.bounciness);
        });
}