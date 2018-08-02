import Vector2 from "../core/vector2";
import Component from "./component";

export class Transform implements Component {
    name: 'Transform';

    position: Vector2;
    rotation: number;
}