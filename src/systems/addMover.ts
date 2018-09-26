import Player from "../components/player";
import { Transform } from "../components/transform";
import Input from "../core/input";
import { Engine } from "../engine";

export default function addMover(input: Input, engine: Engine) {
    engine.subscriber
    .on('tick')
    .with('Player', 'Transform')
    .map(e => e.components)
    .map(({ Player, Transform }: { Player: Player, Transform: Transform }) => {
        const horizontal = input.getAxis('horizontal');
        Transform.position.x += horizontal * 1/60;
    });
}