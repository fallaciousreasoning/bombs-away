import Vector2 from '../core/vector2';
import { Engine } from "../engine";
import { canvas, context } from '../game';
import { useGameView, getWidth } from './addRenderer';

export default function addScoreTracker(engine: Engine) {
    engine.makeSystem('score', 'transform')
        .onEach('tick', ({ transform, score }) => {
            score.score = Math.max(score.score, transform.position.y);
            score.element.innerText = score.score.toFixed(0);
        });
        
    // Render a line for the current score.
    engine.makeSystem('score')
        .onEach('tick', ({ score }) => {
            useGameView();

            const stripeHeight = 0.2;
            const stripeOffset = 0.8;

            context.fillStyle = 'red';
            context.fillRect(0, score.score + stripeHeight / 2 + stripeOffset, getWidth(), stripeHeight);
        });
}