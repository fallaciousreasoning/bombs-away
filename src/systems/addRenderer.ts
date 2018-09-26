import Box from "../components/box";
import Line from "../components/line";
import { Transform } from "../components/transform";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";

export const PIXELS_A_METRE = 64;

export default function addRenderer(canvas: HTMLCanvasElement, engine: Engine) {
    const context = canvas.getContext('2d');

    engine.subscriber.on('tick').subscribe(() => context.clearRect(0, 0, canvas.width, canvas.height));

    engine.subscriber.on('tick')
        .with("box", "transform")
        .map(e => e.components)
        .map(({ transform, box }: { transform: Transform, box: Box }) => {
        const size = new Vector2(box.width, box.height).mul(PIXELS_A_METRE);
        const halfSize = size.div(2);
        const position = transform.position.mul(PIXELS_A_METRE);

        context.fillStyle = box.color;
        context.fillRect(position.x - halfSize.x, position.y - halfSize.y, size.x, size.y);
    });
    engine.subscriber.on('tick')
        .with("line", "transform")
        .map(e => e.components)
        .map(({ transform, line }: { transform: Transform, line: Line }) => {
            
        const position = transform.position.mul(PIXELS_A_METRE);
        const lineEnd = line.direction.mul(line.length).mul(PIXELS_A_METRE).add(position);
        
        context.beginPath();
        context.lineWidth = line.width * PIXELS_A_METRE;
        context.strokeStyle = line.color;
        context.moveTo(position.x, position.y);
        context.lineTo(lineEnd.x, lineEnd.y);
        context.stroke();
    });
}