import Box from "./components/box";
import Line from "./components/line";
import Player from "./components/player";
import { Transform } from "./components/transform";
import Input from "./core/input";
import Vector2 from "./core/vector2";
import { Entity } from "./entity";
import { engine } from './game';
import addMover from "./systems/addMover";
import addRenderer from './systems/addRenderer';

window['engine'] = engine;

const canvas = document.getElementById('root') as HTMLCanvasElement;

const e1 = new Entity();
e1.add(new Player());
e1.add(new Box(1, 1, 'red'));
e1.add(new Transform(new Vector2(2, 1)));
e1.add(new Line(Vector2.unitX, 1, 0.1, 'white'));

const e2 = new Entity();

engine.addEntity(e1);
engine.addEntity(e2);

addRenderer(canvas, engine);
const input = new Input(document);
window['input'] = input;

addMover(input, engine);

