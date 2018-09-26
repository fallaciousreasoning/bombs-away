import Box from "./components/box";
import Line from "./components/line";
import LookAtMouse from "./components/lookAtMouse";
import Player from "./components/player";
import { Transform } from "./components/transform";
import Input from "./core/input";
import Vector2 from "./core/vector2";
import { Entity } from "./entity";
import { engine } from './game';
import addMover from "./systems/addMover";
import addRenderer from './systems/addRenderer';
import addLookAtMouse from "./systems/lookAtMouse";

window['engine'] = engine;

const canvas = document.getElementById('root') as HTMLCanvasElement;

const player = new Entity();
player.add(new Player());
player.add(new Box(1, 1, 'red'));
player.add(new Transform(new Vector2(2, 1)));
player.add(new LookAtMouse());
player.add(new Line(Vector2.unitX, 1, 0.1, 'white'));

const e2 = new Entity();

engine.addEntity(player);
engine.addEntity(e2);

addRenderer(canvas, engine);
const input = new Input(document);
window['input'] = input;

addMover(input, engine);
addLookAtMouse(input, engine);

