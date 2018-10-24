import Line from "../components/line";
import { Transform } from "../components/transform";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";

export const PIXELS_A_METRE = 64;

const colors = ['red', 'yellow', 'blue'];

export default function drawConvexHull(canvas: HTMLCanvasElement, engine: Engine) {
    const context = canvas.getContext('2d');

    engine.makeSystem().on('tick', () => context.clearRect(0, 0, canvas.width, canvas.height));

    engine
        .makeSystem("hull", "transform")
        .onEach('tick', ({ transform, hull }) => {
            const vertices = hull.hull.vertices;
            const centroid = hull.hull.centroid;

            context.save();

            context.scale(PIXELS_A_METRE, PIXELS_A_METRE);
            context.translate(transform.position.x, transform.position.y);
            context.rotate(transform.rotation);

            for (let i = 0; i < vertices.length; ++i) {
                const curr = vertices[i];
                const next = vertices[i === vertices.length - 1 ? 0 : i + 1];

                context.fillStyle = colors[i % colors.length];
                context.strokeStyle = 'black';

                context.beginPath();
                context.moveTo(curr.x, curr.y);
                context.lineTo(next.x, next.y);
                context.lineTo(centroid.x, centroid.y);
                context.fill();
            }
            // context.fillStyle = box.color; -halfSize.y, size.x, size.y);

            context.restore();
        });
}