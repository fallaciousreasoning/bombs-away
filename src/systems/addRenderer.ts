import Line from "../components/line";
import { Transform } from "../components/transform";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";

export const PIXELS_A_METRE = 64;

export default function addRenderer(canvas: HTMLCanvasElement, engine: Engine) {
    const context = canvas.getContext('2d');

    engine.makeSystem(null).on('tick', () => context.clearRect(0, 0, canvas.width, canvas.height));

    engine
        .makeSystem("box", "transform")
        .onEach('tick', ({ transform, box }) => {
            const size = new Vector2(box.width, box.height).mul(PIXELS_A_METRE);
            const halfSize = size.div(2);
            const position = transform.position.mul(PIXELS_A_METRE);

            context.save();

            context.translate(position.x, position.y);
            context.rotate(transform.rotation);
            context.fillStyle = box.color;
            context.fillRect(-halfSize.x, -halfSize.y, size.x, size.y);

            context.restore();
        });

    engine
        .makeSystem("line", "transform")
        .onEach('tick', ({ transform, line }: { transform: Transform, line: Line }) => {
            const position = transform.position.mul(PIXELS_A_METRE);
            const lineEnd = line.direction
                .mul(line.length)
                .rotate(transform.rotation)
                .mul(PIXELS_A_METRE)
                .add(position);
            
            context.beginPath();
            context.lineWidth = line.width * PIXELS_A_METRE;
            context.strokeStyle = line.color;
            context.moveTo(position.x, position.y);
            context.lineTo(lineEnd.x, lineEnd.y);
            context.stroke();
        });
}