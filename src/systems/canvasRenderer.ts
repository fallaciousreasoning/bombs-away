import { Engine } from "../engine";
import { Entityish } from "./system";
import { context } from "../game";
import { useGameView } from "./addRenderer";

let entities: Entityish<['canvasRenderer', 'transform']>[] = [];

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
                context.fillStyle = canvasRenderer.options.fill;
                context.strokeStyle = canvasRenderer.options.stroke;

                context.translate(transform.position.x, transform.position.y);
                context.rotate(transform.rotation);
                context.scale(transform.scale.x, transform.scale.y);

                entity.canvasRenderer.draw(context, entity);
            }
        });
}