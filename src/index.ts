import AliveForTime from "./components/aliveForTime";
import Body from "./components/body";
import { Bounce } from "./components/bounce";
import Box from "./components/box";
import FlipWithMouse from "./components/flipWithMouse";
import Line from "./components/line";
import LookAtMouse from "./components/lookAtMouse";
import Player from "./components/player";
import Spawn from "./components/spawn";
import { Transform } from "./components/transform";
import Weapon from "./components/weapon";
import Input from "./core/input";
import Vector2 from "./core/vector2";
import { Entity } from "./entity";
import { EntityPool } from "./entityPool";
import { engine } from './game';
import addFireManager from "./systems/addFireManager";
import addFlipWithMouse from "./systems/addFlipWithMouse";
import addGravity from "./systems/addGravity";
import addRemoveAfterTime from "./systems/addRemoveAfterTime";
import addRenderer from './systems/addRenderer';
import addBounce from "./systems/bounceSystem";
import addPhysics from "./systems/collisionDetector";
import naivePhysicsResolver from "./systems/collisionResolver";
import addLookAtMouse from "./systems/lookAtMouse";
import addPlayerController from "./systems/playerController";
import addSpawn from "./systems/spawnSystem";

window['engine'] = engine;

const canvas = document.getElementById('root') as HTMLCanvasElement;

const bulletPool = new EntityPool(engine, () => {
    const bullet = new Entity();
    bullet.add(new Line(0, 0.1, 'yellow'));
    bullet.add(new Transform());
    bullet.add(new AliveForTime(0));
    return bullet;

}, bullet => {
    bullet.get('aliveForTime').time = 5.2;
})

const enemyPool = new EntityPool(engine, () => {
    const enemy = new Entity();
    enemy.add(new Box(1, 1, 'blue'));
    enemy.add(new Transform());
    enemy.add(new Body(1, 1, true));
    enemy.add(new Bounce(0.6));
    enemy.add(new AliveForTime(0));
    return enemy;
}, enemy => {
    enemy.get('aliveForTime').time = 12.5;
    enemy.get('body').velocity = Vector2.zero;
});

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
weapon.add(new Weapon((weapon, transform) => {
    const noise = (Math.PI * Math.random()  - Math.PI/2) * (1 - weapon.accuracy);
    const b = bulletPool.get();
    b.get('line').length = weapon.range;
    b.get('transform').position = transform.position;
    b.get('transform').rotation = transform.rotation + noise;
    return b;
}));

const ground = new Entity();
ground.add(new Box(10, 1));
ground.add(new Transform(new Vector2(5, 5)));
ground.add(new Body(10, 1, false));

const spawn = new Entity();
spawn.add(new Box(0.5, 0.5, 'yellow'));
spawn.add(new Transform(new Vector2(8, 0)));
spawn.add(new Spawn((spawn, transform) => {
    const e = enemyPool.get();
    e.get('transform').position = transform.position;
    return e;
}));

engine.addEntity(player);
engine.addEntity(weapon);
engine.addEntity(ground);
engine.addEntity(spawn);

addRenderer(canvas, engine);
const input = new Input(document);
window['input'] = input;

addGravity(engine);
addPhysics(engine);
addBounce(engine);
naivePhysicsResolver(engine);
addPlayerController(input, engine);
addLookAtMouse(input, engine);
addFlipWithMouse(input, engine);
addFireManager(input, engine);
addRemoveAfterTime(engine);
addSpawn(engine);

