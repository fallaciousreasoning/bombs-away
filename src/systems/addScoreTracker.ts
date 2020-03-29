import Vector2 from '../core/vector2';
import { Engine } from "../engine";
import { canvas, context } from '../game';
import { useGameView, getWidth } from './addRenderer';

export default function addScoreTracker(engine: Engine) {
    // Render the current score.
    engine
        .makeSystem('score', 'transform')
        .onEach('tick', ({ score, transform }) => {
            score.score = Math.max(score.score, transform.position.y);
            context['resetTransform']();

            context.font = "30px Arial";
            context.fillStyle = "black";
            context.textBaseline = 'top';

            const text = `Score: ${Math.round(score.score)}`;

            context.fillText(text, 10, 10);
        });

    // Render a line for the current score.
    engine.makeSystem('score')
        .onEach('tick', ({ score }) => {
            useGameView();

            const stripeHeight = 0.2;
            const stripeOffset = 0.8;

            context.fillStyle = 'red';
            context.fillRect(0, score.score + stripeHeight/2 + stripeOffset, getWidth(), stripeHeight);
        });
}