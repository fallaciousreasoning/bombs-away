import Vector2 from "../core/vector2";
import { Engine } from "../engine";
import { input } from "../game";
import { getWidth } from "./addRenderer";

export default function addPlayerController(engine: Engine) {
    engine
        .makeSystem('player', 'body', 'transform')
        .onEach('tick', ({ player, body, transform }, message) => {
            let horizontal = input.getAxis('horizontal');
            if (input.getAxis('shoot'))
                horizontal += input.mousePosition.x < getWidth() / 2 ? -1 : 1;

            let jumpImpulse = 0;
            if ((input.getAxis('jump') || input.getTouchCount() >= 2)
                && player.groundTracker.hasContact) {
                jumpImpulse = -player.jumpImpulse;
            }
            body.angularVelocity += horizontal * player.speed * message.step;
            if (body.angularVelocity > player.speed)
                body.angularVelocity = player.speed;

            if (body.angularVelocity < -player.speed)
                body.angularVelocity = -player.speed;

            body.velocity = new Vector2(body.velocity.x, jumpImpulse || body.velocity.y);
        });
}