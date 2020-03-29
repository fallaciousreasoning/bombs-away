import Vector2 from '../core/vector2';
import { Engine } from "../engine";
import { canvas, context } from '../game';

export default function addScoreTracker(engine: Engine) {
    // Render the current score.
    engine
        .makeSystem('score', 'transform')
        .onEach('tick', ({ score, transform }) => {
            score.score = Math.max(score.score, Math.round(transform.position.y));
            context['resetTransform']();

            context.font = "30px Arial";
            context.fillStyle = "black";
            context.textBaseline = 'top';

            const text = `Score: ${score.score}`;

            context.fillText(text, 10, 10);
        });

    // Render a line for the current score.
    engine.makeSystem('score')
        .onEach('tick', ({ score }) => {

        });
}