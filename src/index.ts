import Hull from "./components/hull";
import { Transform } from "./components/transform";
import Input from "./core/input";
import Vector2 from "./core/vector2";
import { Entity } from "./entity";
import { engine } from './game';
import addRenderer from './systems/addRenderer';
import convexHullTester from "./systems/convexHullTester";
import drawCollider from "./systems/colliderRenderer";
import { Vertices } from "./geometry/vertices";
import { makeCircle, makeBox } from "./geometry/createPolygon";
import { subtract } from "./geometry/subtract";
import { cut } from "./geometry/cut";
import { convexPartition } from "./geometry/bayazitDecomposer";
import { circleCollider } from "./collision/colliderFactory";
import Body from "./components/body";

window['engine'] = engine;
window['debugPoints'] = [];

const canvas = document.getElementById('root') as HTMLCanvasElement;

const player = new Entity();
player.add(circleCollider(1, 8));
player.add(new Transform(new Vector2(5, 5)));
player.add(new Body());
engine.addEntity(player);

addRenderer(canvas, engine);
const input = new Input(document);
window['input'] = input;

drawCollider(canvas, engine);

convexHullTester(input, engine);


