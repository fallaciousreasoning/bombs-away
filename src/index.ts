import Box from "./components/box";
import { Transform } from "./components/transform";
import Vector2 from "./core/vector2";
import { Entity } from "./entity";
import { engine } from './game';
import addRenderer from './systems/addRenderer';

window['engine'] = engine;

const canvas = document.getElementById('root') as HTMLCanvasElement;

const e1 = new Entity();
e1.add(new Box(1, 1, 'red'));
e1.add(new Transform(new Vector2(2, 1)));

const e2 = new Entity();

engine.addEntity(e1);
engine.addEntity(e2);

addRenderer(canvas, engine);

