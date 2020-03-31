export class Text {
    type: "text" = "text";

    horizontalAlign: 'left' | 'right' | 'center' = 'left';
    verticalAlign: 'top' | 'bottom' | 'middle' = 'top';
    fontSize = 30;
    font: 'Arial';

    private _text: string;
    getText: () => string = () => this._text;
    color: string = 'black';

    useCameraCoords = false;

    constructor(text?: string) {
        this._text = text;
    }
}