import { Engine } from "../engine";

export default function addBounce(engine: Engine) {
    engine
        .makeSystem('bounce', 'body')
        .onTargetedMessage('collision', ({ entity }) => {
            const { bounce, body } = entity;
            if (bounce.y)
                body.velocity = body.velocity.withY(-body.velocity.y * bounce.bounciness);
            if (bounce.x)
                body.velocity = body.velocity.withX(-body.velocity.x * bounce.bounciness);
        });
}