import { Color } from "../core/color";

export class ColliderRenderer {
    type: 'colliderRenderer' = 'colliderRenderer';

    alpha = 1;
    strokeWidth: number = 1;
    stroke?: string | Color = Color.transparent;
    fill: string | Color = Color.transparent;

    constructor(fill?: Color | string, stroke?: Color | string) {
        this.fill = fill || Color.transparent;
        this.stroke = stroke || this.fill;
    }
}