import Vector2 from "../core/vector2";

export default class Line {
    name: 'line' = 'line';

    direction = Vector2.up;
    
    length: number;
    width: number;

    color: string;

    constructor(length: number, width?: number, color?: string){
        this.length = length;
        this.width = width || 1/64;
        this.color = color || 'black';
    }
}