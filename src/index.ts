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
import naivePhysicsResolver from "./systems/collisionResolver";
import addPlayerController from "./systems/playerController";
import Player from "./components/player";

window['engine'] = engine;
window['debugPoints'] = [];

const canvas = document.getElementById('root') as HTMLCanvasElement;

const player = new Entity();
player.add(new Player());
player.add(circleCollider(1, 9));
player.add(new Transform(new Vector2(5, 1)));
player.add(new Body(1));

const ground = new Entity();
ground.add(boxCollider(10, 1));
ground.add(new Transform(new Vector2(5, 5)));

const block = new Entity();
block.add(boxCollider(1, 2));
block.add(new Transform(new Vector2(7, 3)));
block.add(new Body(100));

const ramp = new Entity();
ramp.add({
    type: 'collider',
    elasticity: 0.5,
    friction: 0,
    isTrigger: false,
    vertices: new Vertices([
        new Vector2(-1, 0),
        new Vector2(-1, -1),
        new Vector2(1, 0)
    ])
});
ramp.add(new Transform(new Vector2(7, 2)));

engine.addEntity(ramp);
engine.addEntity(player);
engine.addEntity(ground);
engine.addEntity(block);

addRenderer(canvas, engine);
const input = new Input(document);
window['input'] = input;

drawCollider(canvas, engine, true);
addGravity(engine);
addPlayerController(input, engine);
addPhysics(engine);
naivePhysicsResolver(engine);
convexHullTester(input, engine);


