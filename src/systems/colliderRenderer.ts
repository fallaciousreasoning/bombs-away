import Vector2 from "../core/vector2";
import { Engine } from "../engine";
import { Fixture } from "../collision/fixture";
import { Collider } from "../components/collider";
import { Vertices } from "../geometry/vertices";
import { AABBTree } from "../geometry/dynamicAabbTree";
import { fixtures } from "./fixtureManager";
import { context, canvas } from "../game";
import { tree } from "./collisionDetector";
import { useGameView } from "./addRenderer";
import { ColliderRenderer } from "../components/colliderRenderer";
import { Color } from "../core/color";

export const PIXELS_A_METRE = 64;

interface DebugRenderConfig {
    drawEdges: boolean,
    fillShapes: boolean,
    drawVertices: boolean,
    drawContacts: boolean,
    drawCentroids: boolean,
    drawNormals: boolean,
    drawAABBTree: boolean,
    debugVertices: Vertices[],
    debugPoints: Vector2[],
}

export const renderConfig: DebugRenderConfig = {
    drawEdges: true,
    fillShapes: true,
    drawVertices: false,
    drawContacts: true,
    drawCentroids: false,
    drawNormals: false,
    drawAABBTree: false,
    debugVertices: [],
    debugPoints: [],
};

window['renderConfig'] = renderConfig;

export const drawBox = (position: Vector2, width: number, height: number = width, color: string = 'blue', stroke = false) => {
    const scaledSize = new Vector2(width, height).mul(PIXELS_A_METRE);
    const origin = position.mul(PIXELS_A_METRE).sub(scaledSize.div(2));
    const type = stroke ? 'stroke' : 'fill';

    context.strokeStyle = color;
    context[`${type}Rect`](origin.x, origin.y, scaledSize.x, scaledSize.y);
}

export default function drawCollider(engine: Engine) {
    const context = canvas.getContext('2d');
    const renderPoint = (position: { x: number, y: number }, size = 0.2) => context.fillRect(position.x - size / 2, position.y - size / 2, size, size);

    const contacts: Vector2[] = [];
    const pointSize = 0.2;

    const drawVertices = (vertices: Vertices, color: string) => {
        context.save();

        useGameView();

        if (renderConfig.drawEdges) {
            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = color;
            for (let i = 0; i < vertices.length; ++i) {
                const curr = vertices.getVertex(i);
                const next = vertices.getVertex(i + 1);

                context.lineWidth = 1 / PIXELS_A_METRE;
                context.moveTo(curr.x, curr.y);
                context.lineTo(next.x, next.y);
            }
            context.stroke();
        }

        context.restore();
    };

    const fillVertices = (vertices: Vertices, color: Color | string) => {
        context.beginPath();
        context.fillStyle = typeof color === 'string' ? color : color.hex;

        for (const vertex of vertices.vertices)
            context.lineTo(vertex.x, vertex.y);

        context.fill();
    }

    const drawFixture = (collider: Collider, renderer: ColliderRenderer, fixture: Fixture) => {
        const vertices = fixture.vertices;
        const centroid = fixture.vertices.centroid;
        context.save();

        useGameView();
        context.translate(fixture.transform.position.x, fixture.transform.position.y);
        context.rotate(fixture.transform.rotation);

        context.globalAlpha = renderer.alpha;

        if (renderConfig.drawEdges) {
            context.beginPath();
            context.lineWidth = renderer.strokeWidth / PIXELS_A_METRE;
            context.strokeStyle = typeof renderer.stroke === 'string' ? renderer.stroke : renderer.stroke.hex;

            const first = vertices.getVertex(0);
            context.moveTo(first.x, first.y);
            for (let i = 1; i < vertices.length; ++i) {
                const curr = vertices.getVertex(i);
                context.lineTo(curr.x, curr.y);
            }
            context.closePath();

            context.stroke();
        }

        if (renderConfig.fillShapes && renderer.fill) {
            fillVertices(vertices, renderer.fill);
        }

        if (renderConfig.drawNormals) {
            context.beginPath();
            context.strokeStyle = 'green';
            for (let i = 0; i < vertices.length; ++i) {
                const curr = vertices.getVertex(i);
                const next = vertices.getVertex(i + 1);

                const start = curr.add(next).mul(0.5);
                const end = start.add(vertices.normals[i]);

                context.moveTo(start.x, start.y);
                context.lineTo(end.x, end.y);
            }
            context.stroke();
        }

        if (renderConfig.drawVertices) {
            for (let i = 0; i < vertices.length; ++i) {
                context.fillStyle = 'green';
                const vertex = vertices.getVertex(i);
                context.fillRect(vertex.x - pointSize / 2, vertex.y - pointSize / 2, pointSize, pointSize);
            }
        }

        if (renderConfig.drawCentroids) {
            context.fillStyle = 'blue';
            context.fillRect(centroid.x - pointSize / 2, centroid.y - pointSize / 2, pointSize, pointSize);
        }

        context.restore();
    }

    engine
        .makeSystem("collider", "colliderRenderer")
        .onEach('tick', ({ collider, colliderRenderer }) => {
            for (const fixture of collider.fixtures)
                drawFixture(collider, colliderRenderer, fixture);
        });

    engine
        .makeSystem()
        .onMessage('collision', message => {
            contacts.push(...message.contacts);
        })
        .onMessage('tick', () => {
            const points: { x: number, y: number }[] = window['debugPoints'];
            if (!points && !renderConfig.drawContacts) {
                return;
            }

            context.save();

            useGameView();
            context.fillStyle = "red";

            const pointSize = 0.2;
            if (renderConfig.drawContacts) {
                context.fillStyle = 'red';
                for (const contact of contacts)
                    context.fillRect(contact.x - pointSize / 2, contact.y - pointSize / 2, pointSize, pointSize)
            }

            for (const point of points) {
                renderPoint(point);
            }

            context.restore();

            // Clear the array of contact points.
            contacts.length = 0;
        });

    engine.makeSystem()
        .on('tick', () => {
            for (const v of renderConfig.debugVertices)
                drawVertices(v, 'red');

            for (const point of renderConfig.debugPoints)
                drawBox(point, pointSize, pointSize, 'blue');
        });
}