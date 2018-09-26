import Component from "./component";

export default class Box implements Component {
    name = 'box';

    width: number;
    height: number;

    color: string;

    constructor(width: number, height?: number, color?: string){
        this.width = width;
        this.height = height || width;
        this.color = color || 'black';
    }
}