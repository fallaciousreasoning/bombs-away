import Hull from "./components/hull";
import { Transform } from "./components/transform";
import Input from "./core/input";
import Vector2 from "./core/vector2";
import { Entity } from "./entity";
import { engine } from './game';
import addRenderer from './systems/addRenderer';
import convexHullTester from "./systems/convexHullTester";
import drawConvexHull from "./systems/drawConvexHull";
import { Vertices } from "./geometry/vertices";

window['engine'] = engine;

const canvas = document.getElementById('root') as HTMLCanvasElement;

const convexHull = new Entity();
convexHull.add(new Hull(new Vertices([
    new Vector2(0),
    new Vector2(-1, 1),
    new Vector2(-1.1, 2),
    new Vector2(1, 3),
    new Vector2(4, 3),
    new Vector2(2, 0)
])));
convexHull.add(new Transform(new Vector2(3.5)));

engine.addEntity(convexHull);

addRenderer(canvas, engine);
const input = new Input(document);
window['input'] = input;

drawConvexHull(canvas, engine);

convexHullTester(input, engine);


