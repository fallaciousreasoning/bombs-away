import { boxCollider, circleCollider, bombCollider } from "./collision/colliderFactory";
import AliveForTime from "./components/aliveForTime";
import Body from "./components/body";
import { Camera } from "./components/camera";
import { Circle } from "./components/circle";
import { CollisionTexture } from "./components/collisionTexture";
import Explodes from "./components/explodes";
import { FollowTransform } from "./components/followTransform";
import GroundTiler from "./components/groundTiler";
import Player from "./components/player";
import Spawn from "./components/spawn";
import { StayOnMouse } from "./components/stayOnMouse";
import { Tag } from "./components/tag";
import { Transform } from "./components/transform";
import Vector2 from "./core/vector2";
import { Entity } from "./entity";
import { canvas, engine } from './game';
import { polygonsToString } from "./geometry/serializer";
import addFollows from "./systems/addFollows";
import addGravity from "./systems/addGravity";
import addGroundTiler from "./systems/addGroundTiler";
import addRemoveAfterTime from "./systems/addRemoveAfterTime";
import addRenderer, { getWidth, METRES_A_PIXEL } from './systems/addRenderer';
import drawCollider from "./systems/colliderRenderer";
import addPhysics from "./systems/collisionDetector";
import convexHullTester from "./systems/convexHullTester";
import { deformTerrain } from "./systems/deformTerrain";
import { addFixtureManager } from "./systems/fixtureManager";
import addPlayerController from "./systems/playerController";
import removeDeadThings from "./systems/removeDeadThings";
import addSpawn from "./systems/spawnSystem";
import { Entityish } from "./systems/system";
import addExplosionManager from "./systems/addExplosionManager";
import addContactTracker from "./systems/addContactTracker";
import ContactTracker from "./components/contactTracker";
import Score from "./components/score";
import addScoreTracker from "./systems/addScoreTracker";
import addVelocityClamp from "./systems/addVelocityClamp";
import VelocityClamp from "./components/velocityClamp";
import { basicEmitter, explosionEmitter } from "./particles/emitterFactory";
import particleManager from "./systems/particleManager";

window['engine'] = engine;
window['debugPoints'] = [];
window['polyString'] = polygonsToString;

addFixtureManager(engine);

const makeExplosion = (radius: number) => {
    const explosion = new Entity();
    explosion.add(new Transform);
    explosion.add(explosionEmitter(radius/2));
    return explosion;
};

const makeBomb = () => {
    const size = 0.4 + Math.random() * 0.6;
    const radiusMultiplier = 4;
    const forceMultiplier = 50;

    const bomb = new Entity();

    const explodes = new Explodes();
    explodes.radius = radiusMultiplier * size;
    explodes.force = forceMultiplier * size;
    explodes.with = makeExplosion;
    bomb.add(explodes);
    bomb.add(new Transform());
    bomb.add(bombCollider(size, size * 1.5));
    bomb.add(new AliveForTime(5));

    const body = new Body();
    bomb.add(body);

    return bomb as Entityish<['transform']>;
}

const makeGroundTile = () => {
    const gridSize = 0.333333
    const ground = new Entity();
    ground.add(new Tag('terrain'));
    const collider = boxCollider(5, 5, 'green');
    collider.fillColor = 'green';
    ground.add(collider);
    ground.add(new Transform());

    ground.add(new CollisionTexture(5, 5, gridSize));
    return ground as Entityish<['transform', 'collider']>;
}

const makeWallTile = () => {
    const height = 10;
    const width = 1;
    const wall = new Entity();
    wall.add(new Tag('wall'));
    wall.add(boxCollider(width, height, 'blue'));
    wall.add(new Transform());
    return wall as Entityish<['transform', 'collider']>;
}

const player = new Entity();
player.add(new Tag('player'));
const playerComponent = new Player();
// The player can jump if the ground tracker isn't touching the player.
playerComponent.groundTracker = new ContactTracker('player', true);

const playerTransform = new Transform(new Vector2(5, -1));
player.add(playerComponent);
const playerCollider = circleCollider(1, 9);
playerCollider.friction = 0.1;
player.add(playerCollider);
player.add(playerTransform);
player.add(new Body(3));
player.add(new Score());

const playerGroundDetector = new Entity();
const playerGroundDetectorTransform = new Transform(new Vector2(0, 1), 0, playerTransform);
playerGroundDetectorTransform.lockRotation = true;
playerGroundDetector.add(playerGroundDetectorTransform);
playerGroundDetector.add(playerComponent.groundTracker);
playerGroundDetector.add(boxCollider(1.2, 0.2, 'red', true));

const bomber = new Entity();
bomber.add(new FollowTransform(player, { lockX: true, offset: new Vector2(0, -20) }));
bomber.add(new Spawn(makeBomb));
bomber.add(boxCollider(getWidth(), 1, 'red', true));
bomber.add(new Transform(new Vector2(getWidth() / 2, 0)));

const block = new Entity();
block.add(boxCollider(1, 1));
block.add(new Transform(new Vector2(7, -3), Math.PI / 2));
block.add(new Body(10));

const groundTiler = new Entity();
groundTiler.add(new Transform(new Vector2(2.5, 3)));
groundTiler.add(new GroundTiler(player, makeGroundTile, (tileWidth) => getWidth() / tileWidth));

const leftWallTiler = new Entity();
leftWallTiler.add(new Transform(new Vector2(-0.5, -20)));
leftWallTiler.add(new GroundTiler(player, makeWallTile, 1));

const rightWallTiler = new Entity();
rightWallTiler.add(new Transform(new Vector2(getWidth() + 0.5, -20)));
rightWallTiler.add(new GroundTiler(player, makeWallTile, 1));

const camera = new Entity();
camera.add(new Transform(new Vector2(canvas.width * METRES_A_PIXEL / 2, 0)));
camera.add(new FollowTransform(player, { lockX: true, spring: 10 }));
camera.add(new Camera());

engine.addEntity(player);
engine.addEntity(playerGroundDetector);
engine.addEntity(bomber);

engine.addEntity(groundTiler);
engine.addEntity(leftWallTiler);
engine.addEntity(rightWallTiler);

engine.addEntity(camera);

addRenderer(engine);

addFollows(engine);
addExplosionManager(engine);
addSpawn(engine);
drawCollider(engine);
particleManager(engine);
addGravity(engine);
addPlayerController(engine);
addPhysics(engine);
convexHullTester(engine);
deformTerrain(engine);
removeDeadThings(engine);
addRemoveAfterTime(engine);
addGroundTiler(engine);
addContactTracker(engine);
addScoreTracker(engine);
addVelocityClamp(engine);

