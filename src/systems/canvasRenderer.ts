import { Engine } from "../engine";
import { Entityish } from "./system";
import { context } from "../game";
import { useGameView } from "./addRenderer";
import { CanvasRenderer } from "../components/canvasRenderer";

let entities: Entityish<['canvasRenderer', 'transform']>[] = [];

export const applyRendererColors = (context: CanvasRenderingContext2D, renderer: CanvasRenderer) => {
    context.fillStyle = renderer.options.fill;
    context.strokeStyle = renderer.options.stroke;
    context.lineWidth = renderer.options.strokeWidth;
}

export default (engine: Engine) => {
    engine.makeSystem('canvasRenderer', 'transform')
        .onTargetedMessage('instantiate', ({ entity }) => {
            entities.push(entity);
        })
        .onTargetedMessage('destroy', ({ entity }) => {
            const index = entities.indexOf(entity);
            entities.splice(index, 1);
        })
        .onMessage('tick', () => {
            useGameView();

            for (const entity of entities) {
                const { canvasRenderer, transform } = entity;

                context.save();

                applyRendererColors(context, canvasRenderer);

                context.translate(transform.position.x, transform.position.y);
                context.rotate(transform.rotation);
                context.scale(transform.scale.x, transform.scale.y);

                entity.canvasRenderer.draw(context, entity);
                context.restore();
            }
        });
}