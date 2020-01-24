import Body from "../components/body";
import Player from "../components/player";
import Input from "../core/input";
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
            if (input.getAxis('jump') || input.getTouchCount() >= 2) {
                jumpImpulse = -player.jumpImpulse;
                console.log('Has contact?', player.groundTracker.hasContact);
            }
            body.velocity = new Vector2(horizontal * 10 * message.step + body.velocity.x, jumpImpulse || body.velocity.y);
        });
}