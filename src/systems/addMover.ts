import Player from "../components/player";
import { Transform } from "../components/transform";
import Input from "../core/input";
import { Engine } from "../engine";

export default function addMover(input: Input, engine: Engine) {
    engine.subscriber
    .on('tick')
    .with('player', 'transform')
    .map(e => e.components)
    .map(({ player, transform }: { player: Player, transform: Transform }) => {
        const horizontal = input.getAxis('horizontal');
        transform.position.x += horizontal * 1/60 * player.speed;
    });
}