import Vector2 from "../core/vector2";
import { Engine } from "../engine";
import { input } from "../game";
import { getWidth } from "./addRenderer";
import Player from "../components/player";
import { Collider } from "../components/collider";

export default function addPlayerController(engine: Engine) {
    const managePowers = (player: Player, collider: Collider, step: number) => {
        if (player.isFast)
            player.fastFor -= step;

        if (player.isInvulnerable)
            player.invulnerableFor -= step;

        collider.fillColor = player.isFast ? 'purple' : undefined;
        collider.color = player.isInvulnerable ? 'blue' : 'black';
        collider.strokeThickness = player.isInvulnerable ? 10 : 1;
    }

    engine
        .makeSystem('player', 'body', 'collider')
        .onEach('tick', ({ player, body, collider }, message) => {
            managePowers(player, collider, message.step);

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

            body.velocity = new Vector2(body.velocity.x + horizontal * 2 * message.step, jumpImpulse || body.velocity.y);
        });
}