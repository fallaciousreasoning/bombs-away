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
import removeDeadThings from "./systems/removeDeadThings";
import { Tag } from "./components/tag";
import Health from "./components/health";
import applyDamage from "./systems/applyDamage";
import Damage from "./components/damage";
import convexHullTester from "./systems/convexHullTester";
import Hull from "./components/hull";
import { ConvexHull } from "./geometry/convexHull";
import drawConvexHull from "./systems/drawConvexHull";

window['engine'] = engine;

const canvas = document.getElementById('root') as HTMLCanvasElement;

const convexHull = new Entity();
convexHull.add(new Hull(new ConvexHull([
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


