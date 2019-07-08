import Line from "../components/line";
import { Transform } from "../components/transform";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";

export const PIXELS_A_METRE = 64;
export const METRES_A_PIXEL = 1/PIXELS_A_METRE;

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
            context.arc(position.x, position.y, radius, 0, Math.PI*2);
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
        const origin = transform.position
            .sub(textureSize.mul(0.5))
            .mul(PIXELS_A_METRE);

        for (let i = 0; i < collisionTexture.height; ++i)
          for (let j = 0; j < collisionTexture.width; ++j) {
              const point = new Vector2(j, i);
              if (collisionTexture.grid[i][j] == 0) continue;
              
              const position = origin.add(point.mul(collisionTexture.gridSize).mul(PIXELS_A_METRE));

              context.fillStyle = 'blue';
              context.fillRect(position.x, position.y, collisionTexture.gridSize*PIXELS_A_METRE, collisionTexture.gridSize*PIXELS_A_METRE);
          }
    });
}