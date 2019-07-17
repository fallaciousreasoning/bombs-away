import Line from "../components/line";
import { Transform } from "../components/transform";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";

export const PIXELS_A_METRE = 64;
export const METRES_A_PIXEL = 1/PIXELS_A_METRE;

export default function addRenderer(canvas: HTMLCanvasElement, engine: Engine) {
    const context = canvas.getContext('2d');

    engine.makeSystem().on('tick', () => context.clearRect(0, 0, canvas.width, canvas.height));
    engine.makeSystem('camera', 'transform')
        .onEach('tick', ({ transform }) => {
            (context as any).resetTransform();
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.setTransform(1, 0, 0, 1, -transform.position.x*PIXELS_A_METRE + canvas.width/2,
                -transform.position.y*PIXELS_A_METRE + canvas.height / 2);
        });

    engine
        .makeSystem("box", "transform")
        .onEach('tick', ({ transform, box }) => {
            const size = new Vector2(box.width, box.height).mul(PIXELS_A_METRE).round();
            const halfSize = size.div(2);
            const position = transform.position.mul(PIXELS_A_METRE).round();

            context.save();

            context.translate(position.x, position.y);
            context.rotate(transform.rotation);
            context.fillStyle = box.color;
            context.fillRect(-halfSize.x, -halfSize.y, size.x, size.y);

            context.restore();
        });

    engine.makeSystem("circle", "transform")
        .onEach('tick', ({ transform, circle }) => {
            const radius = circle.radius * PIXELS_A_METRE;
            const position = transform.position.mul(PIXELS_A_METRE).round();

            context.save();

            context.translate(position.x, position.y);
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(0, 0, radius, 0, Math.PI*2);
            context.fill();

            context.restore();
        })

    engine
        .makeSystem("line", "transform")
        .onEach('tick', ({ transform, line }: { transform: Transform, line: Line }) => {
            const position = transform.position.mul(PIXELS_A_METRE).round();
            const lineEnd = line.direction
                .mul(line.length)
                .rotate(transform.rotation)
                .mul(PIXELS_A_METRE)
                .add(position)
                .round();
            
            context.beginPath();
            context.lineWidth = line.width * PIXELS_A_METRE;
            context.strokeStyle = line.color;
            context.moveTo(position.x, position.y);
            context.lineTo(lineEnd.x, lineEnd.y);
            context.stroke();
        });
}