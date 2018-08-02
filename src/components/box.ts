import Component from "./component";

export default class Box implements Component {
    name = 'Box';

    width: number;
    height: number;

    canvas: CanvasRenderingContext2D;
}