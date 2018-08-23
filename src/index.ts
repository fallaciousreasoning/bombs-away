import Box from "./components/box";
import { Transform } from "./components/transform";
import Vector2 from "./core/vector2";
import { Entity } from "./entity";
import { engine } from './game';

const canvas = document.getElementById('root') as any;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

window['engine'] = engine;

const e1 = new Entity();
e1.add(new Box(128, 128, 'red'));
e1.add(new Transform());

const e2 = new Entity();

engine.addEntity(e1);
engine.addEntity(e2);

engine.subscriber.on('tick').subscribe(() => context.clearRect(0, 0, canvas.width, canvas.height));
engine.subscriber.on('tick').with(["Box", "Transform"]).map(e => e.components).map(({ Transform, Box }: { Transform: Transform, Box: Box }) => {
    const halfSize = new Vector2(Box.width, Box.height).div(2);
    context.fillStyle = Box.color;
    context.fillRect(Transform.position.x - halfSize.x, Transform.position.y - halfSize.y, Box.width, Box.height);
});

