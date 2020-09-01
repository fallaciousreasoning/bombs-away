import { Entity } from "../entity";
import { Entityish } from "../systems/system";
import { Color } from "../core/color";
import { CanvasRendererOptions } from "../factories/rendererFactory";

type DrawHandler = (context: CanvasRenderingContext2D, entity: Entity) => void;

export class CanvasRenderer {
    type: 'canvasRenderer' = 'canvasRenderer';
    draw: DrawHandler;
    options: CanvasRendererOptions;

    constructor(draw: DrawHandler, options?: CanvasRendererOptions) {
        this.draw = draw;
        this.options = options || {
            alpha: 0
        };
    }
}