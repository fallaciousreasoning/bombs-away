import Vector2 from "../core/vector2";
import Component from "./component";

export default class Line implements Component {
    name = 'line';

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