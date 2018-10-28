import Line from "../components/line";
import { Transform } from "../components/transform";
import Vector2 from "../core/vector2";
import { Engine } from "../engine";

export const PIXELS_A_METRE = 64;

const colors = ['red', 'yellow', 'blue'];

export default function drawCollider(canvas: HTMLCanvasElement, engine: Engine, drawContacts = false, drawNormals = false) {
    const context = canvas.getContext('2d');
    const renderPoint = (position: { x: number, y: number }, size = 0.2) => context.fillRect(position.x - size / 2, position.y - size / 2, size, size);

    engine.makeSystem().on('tick', () => context.clearRect(0, 0, canvas.width, canvas.height));
    const contacts: Vector2[] = [];
    const pointSize = 0.2;
    engine
        .makeSystem("collider", "transform")
        .onEach('tick', ({ transform, collider }) => {
            const vertices = collider.vertices;
            const centroid = collider.vertices.centroid;

            context.save();

            context.scale(PIXELS_A_METRE, PIXELS_A_METRE);
            context.translate(transform.position.x, transform.position.y);
            context.rotate(transform.rotation);

            context.beginPath();
            context.strokeStyle = collider.color || 'black';
            for (let i = 0; i < vertices.length; ++i) {
                const curr = vertices.getVertex(i);
                const next = vertices.getVertex(i + 1);

                context.lineWidth = 1 / PIXELS_A_METRE;
                context.moveTo(curr.x, curr.y);
                context.lineTo(next.x, next.y);
                context.lineTo(centroid.x, centroid.y);
            }
            context.stroke();

            if (drawNormals) {
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

            for (let i = 0; i < vertices.length; ++i) {
                context.fillStyle = 'green';
                const vertex = vertices.getVertex(i);
                context.fillRect(vertex.x - pointSize / 2, vertex.y - pointSize / 2, pointSize, pointSize);
            }

            context.fillStyle = 'blue';
            context.fillRect(centroid.x - pointSize / 2, centroid.y - pointSize / 2, pointSize, pointSize);

            context.restore();
        });

    engine
        .makeSystem()
        .onMessage('collision', message => {
            contacts.push(...message.contacts);
        })
        .onMessage('tick', () => {
            const points: { x: number, y: number }[] = window['debugPoints'];
            if (!points && !drawContacts) {
                return;
            }

            context.save();

            context.scale(PIXELS_A_METRE, PIXELS_A_METRE);
            context.fillStyle = "red";

            const pointSize = 0.2;
            if (drawContacts) {
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
}