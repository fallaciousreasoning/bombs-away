import Body from "../components/body";
import Player from "../components/player";
import Input from "../core/input";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";

export default function addPlayerController(input: Input, engine: Engine) {
    engine.subscriber
    .on('tick')
    .with('player', 'body')
    .map(e => e.components)
    .map(({ player, body }: { player: Player, body: Body }) => {
        const horizontal = input.getAxis('horizontal');
        body.velocity = new Vector2(horizontal * 10, body.velocity.y);
    });
}