import { CanvasRenderer } from "../components/canvasRenderer";
import Vector2 from "../core/vector2";
import { PIXELS_A_METRE, METRES_A_PIXEL } from "../systems/addRenderer";
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
    length: number;
    direction: Vector2;
    width: number;
}
export const lineRenderer = (options: LineOptions) => new CanvasRenderer(context => {
    const lineEnd = options.direction.mul(options.length);

    context.strokeStyle = options.stroke || options.fill;
    context.lineWidth = options.width;
    
    context.beginPath();
    context.lineTo(lineEnd.x, lineEnd.y);
    context.stroke();
}, options);

interface ColliderOptions extends CanvasRendererOptions {
    vertices?: string;
    centroid?: string;
    normals?: string;
    strokeWidth?: number;
}

export const colliderRenderer = (options: ColliderOptions) => {
    return new CanvasRenderer((context, entity) => {
        const strokeWidth = (options.strokeWidth === undefined
            ? 1 : options.strokeWidth)*METRES_A_PIXEL;

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
                context.lineWidth = strokeWidth;
                
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