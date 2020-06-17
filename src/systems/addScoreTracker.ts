import Vector2 from '../core/vector2';
import { Engine } from "../engine";
import { canvas, context } from '../game';
import { useGameView, getWidth } from './addRenderer';
import { setMotivationalMessage } from '../hud';

const motivations = {
    0: "Really?!",
    5: "Are you even trying?",
    10: "Okay..",
    25: "Not bad.",
    50: "Guess that's all right.",
    75: "Wow!",
    100: "Amazing!",
    250: "You have waaaaaay too much time."
}

export default function addScoreTracker(engine: Engine) {
    engine.makeSystem('score', 'transform')
        .onEach('tick', ({ transform, score }) => {
            score.score = Math.max(score.score, transform.position.y);
            score.scoreElement.innerText = score.score.toFixed(0);

            score.highScore = Math.max(score.score, score.highScore);
            score.highScoreElement.innerText = score.highScore.toFixed(0);
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

    // Save the score when an entity with a score is destroyed.
    engine.makeSystem('score')
        .onTargetedMessage('destroy', ({ entity }) => {
            localStorage.setItem(entity.score.scoreName, entity.score.highScore.toString());

            // Give the player a sarcastic message.
            const score = entity.score.score;
            for (const motivationalScore of Object.keys(motivations).map(score => parseInt(score))) {
                if (score > motivationalScore)
                    continue;

                setMotivationalMessage(motivations[motivationalScore]);
                break;
            }
        })
}