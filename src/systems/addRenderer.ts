import Box from "../components/box";
import { Transform } from "../components/transform";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";

export const PIXELS_A_METRE = 64;

export default function addRenderer(canvas: HTMLCanvasElement, engine: Engine) {
    const context = canvas.getContext('2d');

    engine.subscriber.on('tick').subscribe(() => context.clearRect(0, 0, canvas.width, canvas.height));

    engine.subscriber.on('tick').with("Box", "Transform").map(e => e.components).map(({ Transform, Box }: { Transform: Transform, Box: Box }) => {
        const size = new Vector2(Box.width, Box.height).mul(PIXELS_A_METRE);
        const halfSize = size.div(2);
        const position = Transform.position.mul(PIXELS_A_METRE);

        context.fillStyle = Box.color;
        context.fillRect(position.x - halfSize.x, position.y - halfSize.y, size.x, size.y);
    });
}