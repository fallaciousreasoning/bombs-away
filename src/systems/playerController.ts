import { CanvasRenderer } from "../components/canvasRenderer";
import Health from "../components/health";
import Player, { mergeIn } from "../components/player";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";
import { input } from "../game";
import { showMenu } from "../hud";
import { getWidth } from "./addRenderer";

export default function addPlayerController(engine: Engine) {
    const managePowers = (player: Player, health: Health, step: number) => {
        let colorScheme = player.normalColor;

        if (player.isFast) {
            colorScheme = mergeIn(colorScheme, player.fastColor, player.fastFor / player.fastTime);
            player.fastFor -= step;
        }

        if (player.isInvulnerable) {
            colorScheme = mergeIn(colorScheme, player.invulnerableColor, player.invulnerableFor / player.invulnerableTime);
            player.invulnerableFor -= step;

            health.health = Number.POSITIVE_INFINITY;

            // If we're no longer invulnerable, restore the player's
            // health.
            if (!player.isInvulnerable)
                health.health = player.defaultHealth;
        }

        const rendererOptions = player.rendererOptions;
        rendererOptions.fill = colorScheme.fill.hex;
        rendererOptions.stroke = colorScheme.stroke.hex;
        rendererOptions.strokeWidth = colorScheme.thickness
    }

    engine
        .makeSystem('player', 'body', 'health')
        .onEach('tick', ({ player, body, health }, message) => {
            managePowers(player, health, message.step);

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

            if (!horizontal)
                body.angularVelocity -= body.angularVelocity * player.angularDrag * message.step;

            body.velocity = new Vector2(body.velocity.x + horizontal * 2 * message.step, jumpImpulse || body.velocity.y);
        });

    engine.makeSystem('player')
        .onTargetedMessage('destroy', () => {
            showMenu();
        })
}