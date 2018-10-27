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
import { circleCollider, boxCollider } from "./collision/colliderFactory";
import Body from "./components/body";
import addGravity from "./systems/addGravity";
import addPhysics from "./systems/collisionDetector";

window['engine'] = engine;
window['debugPoints'] = [];

const canvas = document.getElementById('root') as HTMLCanvasElement;

const player = new Entity();
player.add(circleCollider(1, 8));
player.add(new Transform(new Vector2(5, 1)));
player.add(new Body(true));

const ground = new Entity();
ground.add(boxCollider(10, 1));
ground.add(new Transform(new Vector2(5, 5)));
ground.add(new Body());

engine.addEntity(player);
engine.addEntity(ground);

addRenderer(canvas, engine);
const input = new Input(document);
window['input'] = input;

drawCollider(canvas, engine);
addGravity(engine);
addPhysics(engine);

convexHullTester(input, engine);


