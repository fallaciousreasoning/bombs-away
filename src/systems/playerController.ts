import Body from "../components/body";
import Player from "../components/player";
import Input from "../core/input";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";
import { input } from "../game";

export default function addPlayerController(engine: Engine) {
    engine
    .makeSystem('player', 'body', 'transform')
    .onEach('tick', ({ player, body, transform }, message) => {
        const horizontal = input.getAxis('horizontal');
        let jumpImpulse = 0;
        if (input.getAxis('jump')) {
            jumpImpulse = -player.jumpImpulse;
        }
        body.velocity = new Vector2(horizontal * 10 * message.step + body.velocity.x, jumpImpulse || body.velocity.y);
    });
}