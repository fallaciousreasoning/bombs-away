import Box from "../components/box";
import { Transform } from "../components/transform";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";

export default function makeRenderer(canvas: HTMLCanvasElement, engine: Engine) {
    const context = canvas.getContext('2d');

    engine.subscriber.on('tick').subscribe(() => context.clearRect(0, 0, canvas.width, canvas.height));

    engine.subscriber.on('tick').with(["Box", "Transform"]).map(e => e.components).map(({ Transform, Box }: { Transform: Transform, Box: Box }) => {
        const halfSize = new Vector2(Box.width, Box.height).div(2);
        context.fillStyle = Box.color;
        context.fillRect(Transform.position.x - halfSize.x, Transform.position.y - halfSize.y, Box.width, Box.height);
    });
}