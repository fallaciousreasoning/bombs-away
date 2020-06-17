
export default class Score {
    type: 'score' = 'score';
    score = 0;
    highScore = 0;

    // The element to display the score inside.
    scoreElement: HTMLElement;

    // The element to display the high score inside.
    highScoreElement: HTMLElement;

    // The name this score is saved as.
    scoreName: string;

    // Score requires an element to display inside of.
    constructor(scoreElementSelector: string, highScoreElementSelector: string) {
        this.scoreElement = document.querySelector(scoreElementSelector);
        this.highScoreElement = document.querySelector(highScoreElementSelector);

        // Load the high score immediately.
        this.scoreName = highScoreElementSelector;
        this.highScore = parseInt(localStorage.getItem(this.scoreName)) || 0;
        this.highScoreElement.innerText = this.highScore.toFixed(0);
    }
}