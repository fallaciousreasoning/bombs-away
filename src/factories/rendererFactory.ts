import { CanvasRenderer } from "../components/canvasRenderer";
import Vector2 from "../core/vector2";
import { PIXELS_A_METRE } from "../systems/addRenderer";
import { verticesFromString } from "../geometry/serializer";
export interface CanvasRendererOptions {
    fill?: string;
    stroke?: string;
    alpha?: number;
}

interface BoxOptions extends CanvasRendererOptions {
    width: number;
    height: number;
}
export const boxRenderer = (options: BoxOptions) => {
    const size = new Vector2(options.width, options.height)
    const halfSize = size.div(2);

    return new CanvasRenderer(context => {
        if (options.fill) {
            context.fillRect(
                -halfSize.x,
                -halfSize.y,
                size.x,
                size.y);
        }
        if (options.stroke) {
            context.strokeRect(
                -halfSize.x,
                -halfSize.y,
                size.x,
                size.y);
        }
    }, options);
}

interface CircleOptions extends CanvasRendererOptions {
    radius: number;
}
export const circleRenderer = (options: CircleOptions) => new CanvasRenderer(context => {
    context.beginPath();
    context.arc(0, 0, options.radius, 0, Math.PI * 2);
    if (options.fill)
        context.fill();
    if (options.stroke)
        context.stroke();
}, options);

interface LineOptions extends CanvasRendererOptions {

}
export const lineRenderer = (options: LineOptions) => new CanvasRenderer(context => {

}, options);

interface ColliderOptions extends CanvasRendererOptions {
    vertices?: string;
    centroid?: string;
    normals?: string;
    strokeWidth?: number;
}

export const colliderRenderer = (options: ColliderOptions) => {
    return new CanvasRenderer((context, entity) => {
        if (!entity.has('collider'))
            throw new Error("Added a collider renderer to entity without collider!");
        for (const fixture of entity.collider.fixtures) {
            const vertices = fixture.vertices;
            if (options.fill) {
                context.beginPath();
                for (const vertex of vertices.vertices)
                    context.lineTo(vertex.x, vertex.y);
                context.fill();
            }

            if (options.stroke) {
                context.beginPath();
                context.lineWidth = options.strokeWidth/PIXELS_A_METRE;
                
                const first = vertices.getVertex(0);
                context.moveTo(first.x, first.y);

                for (let i = 1; i < vertices.length; ++i) {
                    const vertex = vertices.getVertex(i);
                    context.lineTo(vertex.x, vertex.y);
                }
                context.closePath();
                context.stroke();
            }
        }
    }, options);
}