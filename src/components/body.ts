import Vector2 from "../core/vector2";
import Component from "./component";

export default class Body implements Component {
    name = 'body';

    isDynamic: boolean;

    width: number;
    height: number;

    velocity = new Vector2();

    constructor(width: number, height: number, isDynamic?: boolean){
        this.width = width;
        this.height = height;
        this.isDynamic = isDynamic;
    }
}