
export default class Score {
    type: 'score' = 'score';
    score = 0;
    highScore = 0;

    // The element to display the score inside.
    element: HTMLElement;

    // Score requires an element to display inside of.
    constructor(elementSelector: string) {
        this.element = document.querySelector(elementSelector);
    }
}