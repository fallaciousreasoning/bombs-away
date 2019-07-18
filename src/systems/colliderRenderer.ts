import Vector2 from "../core/vector2";
import { Engine } from "../engine";
import { Fixture } from "../collision/fixture";
import { Collider } from "../components/collider";
import { Vertices } from "../geometry/vertices";
import { AABBTree } from "../geometry/dynamicAabbTree";
import { fixtures } from "./fixtureManager";

export const PIXELS_A_METRE = 64;

interface DebugRenderConfig {
    drawEdges: boolean;
    drawVertices: boolean;
    drawContacts: boolean;
    drawCentroids: boolean;
    drawNormals: boolean;
    debugVertices: Vertices[],
    debugPoints: Vector2[]
}

export const config: DebugRenderConfig = {
    drawEdges: true,
    drawVertices: false,
    drawContacts: true,
    drawCentroids: false,
    drawNormals: false,
    debugVertices: [],
    debugPoints: [],
};

window['renderConfig'] = config;

export default function drawCollider(canvas: HTMLCanvasElement, engine: Engine) {
    const context = canvas.getContext('2d');
    const renderPoint = (position: { x: number, y: number }, size = 0.2) => context.fillRect(position.x - size / 2, position.y - size / 2, size, size);

    const contacts: Vector2[] = [];
    const pointSize = 0.2;

    const drawVertices = (vertices: Vertices, color: string) => {
        context.save();

        context.scale(PIXELS_A_METRE, PIXELS_A_METRE);

        if (config.drawEdges) {
            context.beginPath();
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

    const drawBox = (position: Vector2, width: number, height: number = width, color: string = 'blue', stroke=false) => {
        const scaledSize = new Vector2(width, height).mul(PIXELS_A_METRE);
        const origin = position.mul(PIXELS_A_METRE).sub(scaledSize.div(2));
        const type = stroke ? 'stroke' : 'fill';

        context[`$${type}Style`] = color;
        context[`${type}Rect`](origin.x, origin.y, scaledSize.x, scaledSize.y);
    }

    const drawFixture = (collider: Collider, fixture: Fixture) => {
        const vertices = fixture.vertices;
        const centroid = fixture.vertices.centroid;
        context.save();

        context.scale(PIXELS_A_METRE, PIXELS_A_METRE);
        context.translate(fixture.transform.position.x, fixture.transform.position.y);
        context.rotate(fixture.transform.rotation);

        if (config.drawEdges) {
            context.beginPath();
            context.strokeStyle = collider.color || 'black';
            for (let i = 0; i < vertices.length; ++i) {
                const curr = vertices.getVertex(i);
                const next = vertices.getVertex(i + 1);

                context.lineWidth = 1 / PIXELS_A_METRE;
                context.moveTo(curr.x, curr.y);
                context.lineTo(next.x, next.y);
            }
            context.stroke();
        }

        if (config.drawNormals) {
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

        if (config.drawVertices) {
            for (let i = 0; i < vertices.length; ++i) {
                context.fillStyle = 'green';
                const vertex = vertices.getVertex(i);
                context.fillRect(vertex.x - pointSize / 2, vertex.y - pointSize / 2, pointSize, pointSize);
            }
        }

        if (config.drawCentroids) {
            context.fillStyle = 'blue';
            context.fillRect(centroid.x - pointSize / 2, centroid.y - pointSize / 2, pointSize, pointSize);
        }

        context.restore();
    }

    engine
        .makeSystem("collider")
        .onEach('tick', ({ collider }) => {
            for (const fixture of collider.fixtures)
                drawFixture(collider, fixture);
        });

    engine
        .makeSystem()
        .onMessage('collision', message => {
            contacts.push(...message.contacts);
        })
        .onMessage('tick', () => {
            const points: { x: number, y: number }[] = window['debugPoints'];
            if (!points && !config.drawContacts) {
                return;
            }

            context.save();

            context.scale(PIXELS_A_METRE, PIXELS_A_METRE);
            context.fillStyle = "red";

            const pointSize = 0.2;
            if (config.drawContacts) {
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
            for (const v of config.debugVertices)
                drawVertices(v, 'red');

            for (const point of config.debugPoints)
                drawBox(point, pointSize, pointSize, 'blue');
        });

    // Render AABBTree

    const tree = new AABBTree<Fixture>();
    setTimeout(() => {
        for (const f of fixtures())
            tree.add(f);
    });
    engine.makeSystem()
        .on('tick', () => {

            for (const node of tree) {
                drawBox(node.bounds.centre, node.bounds.size.x, node.bounds.size.y, node.color, true);
            }
        });
}