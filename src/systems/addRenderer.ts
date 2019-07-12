import Line from "../components/line";
import { Transform } from "../components/transform";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";

export const PIXELS_A_METRE = 64;
export const METRES_A_PIXEL = 1/PIXELS_A_METRE;

const debugPoints = [];
window['debugPoints'] = debugPoints;

export const drawBox = (context: CanvasRenderingContext2D, position: Vector2, size: Vector2, color: string = 'blue') => {
    const scaledSize = size.mul(PIXELS_A_METRE);
    const origin = position.mul(PIXELS_A_METRE).sub(scaledSize.div(2));

    context.fillStyle = color;
    context.fillRect(origin.x, origin.y, scaledSize.x, scaledSize.y);
}

export default function addRenderer(canvas: HTMLCanvasElement, engine: Engine) {
    const context = canvas.getContext('2d');

    engine.makeSystem().on('tick', () => context.clearRect(0, 0, canvas.width, canvas.height));

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

    engine.makeSystem("collisionTexture", "transform")
    .onEach("tick", ({ transform, collisionTexture }) => {
        const textureSize = new Vector2(collisionTexture.width, collisionTexture.height);
        const origin = transform.position.sub(textureSize.div(2));

        for (let i = 0; i < collisionTexture.height; ++i)
          for (let j = 0; j < collisionTexture.width; ++j) {
              const point = new Vector2(j, i);
              if (collisionTexture.grid[i][j] == 0) continue;
              
              const position = origin.add(point.mul(collisionTexture.gridSize));
              drawBox(context, position, new Vector2(0.1));
          }

        for (const point of debugPoints) {
            drawBox(context, point, new Vector2(1), 'green');
        }
    });
}