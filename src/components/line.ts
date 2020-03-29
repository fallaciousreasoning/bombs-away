import Vector2 from "../core/vector2";

export default class Line {
    type: 'line' = 'line';

    direction = Vector2.up;
    
    length: number;
    width: number;

    color: string;

    useCameraCoords = true;

    constructor(length: number, width?: number, color?: string){
        this.length = length;
        this.width = width || 1/64;
        this.color = color || 'black';
    }
}