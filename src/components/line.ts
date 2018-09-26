import Vector2 from "../core/vector2";
import Component from "./component";

export default class Line implements Component {
    name = 'line';
    
    direction: Vector2;
    length: number;
    width: number;

    color: string;

    constructor(direction: Vector2, length: number, width?: number, color?: string){
        this.direction = direction;
        this.length = length;
        this.width = width || 1/64;
        this.color = color || 'black';
    }
}