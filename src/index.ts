import { boxCollider, circleCollider } from "./collision/colliderFactory";
import Body from "./components/body";
import Player from "./components/player";
import Spawn from "./components/spawn";
import { Transform } from "./components/transform";
import Input from "./core/input";
import Vector2 from "./core/vector2";
import { Entity } from "./entity";
import { engine } from './game';
import { Vertices } from "./geometry/vertices";
import addGravity from "./systems/addGravity";
import addRenderer from './systems/addRenderer';
import drawCollider from "./systems/colliderRenderer";
import addPhysics from "./systems/collisionDetector";
import convexHullTester from "./systems/convexHullTester";
import addPlayerController from "./systems/playerController";
import addSpawn from "./systems/spawnSystem";

window['engine'] = engine;
window['debugPoints'] = [];

const canvas = document.getElementById('root') as HTMLCanvasElement;

const makeBomb = (spawn: Entity) => {
    const bomb = new Entity();

    bomb.add(new Transform(spawn.get('transform').position));
    bomb.add(boxCollider(1, 1));

    const body = new Body();
    bomb.add(body);

    return bomb;
}

const bomber = new Entity();
bomber.add(new Spawn(makeBomb));
bomber.add(new Transform(new Vector2(5, 0)));

const player = new Entity();
player.add(new Player());
player.add(circleCollider(1, 9));
player.add(new Transform(new Vector2(5, 3)));
player.add(new Body(1));

const ground = new Entity();
ground.add(boxCollider(10, 1));
ground.add(new Transform(new Vector2(5, 5)));

const block = new Entity();
block.add(boxCollider(1, 1));
block.add(new Transform(new Vector2(7, 3), Math.PI/2));
block.add(new Body(10));

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
ramp.add(new Transform(new Vector2(2, 4.5)));

engine.addEntity(ramp);
engine.addEntity(block);
engine.addEntity(makeBomb(bomber));
engine.addEntity(player);
engine.addEntity(ground);
// engine.addEntity(bomber);

addRenderer(canvas, engine);
const input = new Input(document);
window['input'] = input;

addSpawn(engine);
drawCollider(canvas, engine);
addGravity(engine);
addPlayerController(input, engine);
addPhysics(engine);
convexHullTester(input, engine);


