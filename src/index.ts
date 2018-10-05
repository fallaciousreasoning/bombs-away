import AliveForTime from "./components/aliveForTime";
import Body from "./components/body";
import Box from "./components/box";
import FlipWithMouse from "./components/flipWithMouse";
import Line from "./components/line";
import LookAtMouse from "./components/lookAtMouse";
import Player from "./components/player";
import { Transform } from "./components/transform";
import Weapon from "./components/weapon";
import Input from "./core/input";
import Vector2 from "./core/vector2";
import { Entity } from "./entity";
import { engine } from './game';
import addFireManager from "./systems/addFireManager";
import addFlipWithMouse from "./systems/addFlipWithMouse";
import addGravity from "./systems/addGravity";
import addRemoveAfterTime from "./systems/addRemoveAfterTime";
import addRenderer from './systems/addRenderer';
import addPhysics from "./systems/collisionDetector";
import naivePhysicsResolver from "./systems/collisionResolver";
import addLookAtMouse from "./systems/lookAtMouse";
import addPlayerController from "./systems/playerController";

window['engine'] = engine;

const canvas = document.getElementById('root') as HTMLCanvasElement;

const buildBullet = (weapon: Weapon, at: Transform) => {
    const noise = (Math.PI * Math.random()  - Math.PI/2) * (1 - weapon.accuracy);
    const bullet = new Entity();
    bullet.add(new Line(weapon.range, 0.1, 'yellow'));
    bullet.add(new Transform(at.position, at.rotation + noise));
    bullet.add(new AliveForTime(0.2));
    return bullet;
}

const player = new Entity();
player.add(new Player());
player.add(new Box(1, 2, 'red'));
player.add(new Transform(new Vector2(2, 1)));
player.add(new Body(1, 2, true));

const weapon = new Entity();
weapon.add(new Line(1, 0.3, 'black'));
weapon.add(new Transform(new Vector2(0.65, 0), 0, player.get('transform')));
weapon.add(new LookAtMouse());
weapon.add(new FlipWithMouse());
weapon.add(new Weapon(buildBullet));

const ground = new Entity();
ground.add(new Box(10, 1));
ground.add(new Transform(new Vector2(5, 5)));
ground.add(new Body(10, 1, false));

engine.addEntity(player);
engine.addEntity(weapon);
engine.addEntity(ground);

addRenderer(canvas, engine);
const input = new Input(document);
window['input'] = input;

addGravity(engine);
addPhysics(engine);
naivePhysicsResolver(engine);
addPlayerController(input, engine);
addLookAtMouse(input, engine);
addFlipWithMouse(input, engine);
addFireManager(input, engine);
addRemoveAfterTime(engine);

