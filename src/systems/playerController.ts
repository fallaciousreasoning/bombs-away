import Body from "../components/body";
import Player from "../components/player";
import Input from "../core/input";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";

export default function addPlayerController(input: Input, engine: Engine) {
    engine
    .makeSystem('player', 'body')
    .onEach('tick', ({ player, body }: { player: Player, body: Body }, message) => {
        const horizontal = input.getAxis('horizontal');
        let jumpImpulse = 0;
        if (input.getAxis('jump')) {
            jumpImpulse = -player.jumpImpulse;
        }
        body.velocity = new Vector2(horizontal * 10 * message.step + body.velocity.x, jumpImpulse || body.velocity.y);
    });
}