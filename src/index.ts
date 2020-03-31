import { boxCollider, circleCollider, bombCollider, triangleCollider, fromVertices } from "./collision/colliderFactory";
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
import RemoveWhenFar from "./components/removeWhenFar";
import Powerupable from "./components/powerupable";
import powerups, { powerupColors, powers } from "./systems/powerups";
import Powerup from "./components/powerup";
import Box from "./components/box";
import animator from "./systems/animator";
import AnimateSize from "./components/animateSize";
import { getVerticesFromTexture } from "./systems/collisionTextureManager";
import { Text } from './components/text';
import { random, randomValue } from "./utils/random";
import { Color } from "./core/color";

window['engine'] = engine;
window['debugPoints'] = [];
window['polyString'] = polygonsToString;

addFixtureManager(engine);

const makeExplosion = (radius: number) => {
    const explosion = new Entity();
    explosion.add(new Transform);
    explosion.add(explosionEmitter(radius / 2));
    return explosion;
};

const makeBomb = () => {
    const size = random(0.4, 1);
    const radiusMultiplier = 4;
    const forceMultiplier = 50;

    const bomb = new Entity();

    const explodes = new Explodes();
    explodes.shape = { type: 'circle', radius: radiusMultiplier * size };
    explodes.force = forceMultiplier * size;
    explodes.with = (shape: any) => makeExplosion(shape.radius);
    bomb.add(explodes);
    bomb.add(new Transform());
    bomb.add(bombCollider(size, size * 1.5));
    bomb.add(new AliveForTime(5));

    const body = new Body();
    bomb.add(body);

    return bomb as Entityish<['transform']>;
}

const makePowerup = () => {
    const power = randomValue(powers);
    const powerup = new Entity();
    powerup.add(new Transform(new Vector2(2, -4)));
    powerup.add(new Body());
    powerup.add(new Powerup(power));

    const aliveForTime = new AliveForTime(30);
    aliveForTime.aliveColor = powerupColors[power];
    aliveForTime.deadColor = new Color(aliveForTime.aliveColor.r, aliveForTime.aliveColor.g, aliveForTime.aliveColor.b, 0);
    powerup.add(aliveForTime);

    const collider = triangleCollider(1);
    collider.fillColor = powerupColors[power].toHexString();
    powerup.add(collider);

    return powerup;
}

const makeGrenade = () => {
    const grenade = new Entity();
    grenade.add(new Transform);
    const explodes = new Explodes();
    explodes.shape = { type: 'circle', radius: 5 };
    explodes.force = 100;
    explodes.with = (shape: any) => makeExplosion(shape.radius);
    grenade.add(explodes);

    // Grenades explode immediately.
    grenade.add(new AliveForTime(0));

    return grenade;
}

const makeLaser = () => {
    const laser = new Entity();
    laser.add(new Transform);
    const width = getWidth() * 2;
    const height = 4;
    laser.add(new Box(width, height, '#ff9900'));

    const explodes = new Explodes();
    explodes.force = 0;
    explodes.shape = { type: 'box', width, height };

    laser.add(explodes);

    const duration = 1;
    laser.add(new AliveForTime(duration));
    laser.add(new AnimateSize(new Vector2(1, 0.1), Vector2.one, duration));

    return laser;
}

const makeGroundTile = () => {
    const width = 5;
    const height = 5;

    const gridSize = 0.5
    const ground = new Entity();
    ground.add(new Tag('terrain'));

    ground.add(new Transform());

    const texture = new CollisionTexture(width, height, gridSize);
    ground.add(texture);
    ground.add(new RemoveWhenFar(50, player, Vector2.up));

    const collider = fromVertices(...getVerticesFromTexture(texture));
    collider.fillColor = 'green';
    collider.color = 'green';
    ground.add(collider);

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
const playerCollider = circleCollider(1, 20);
playerCollider.friction = 0.1;
player.add(playerCollider);
player.add(playerTransform);
player.add(new Body(3));
player.add(new Score());
player.add(new Powerupable());

const playerGroundDetector = new Entity();
const playerGroundDetectorTransform = new Transform(new Vector2(0, 1), 0, playerTransform);
playerGroundDetectorTransform.lockRotation = true;
playerGroundDetector.add(playerGroundDetectorTransform);
playerGroundDetector.add(playerComponent.groundTracker);
playerGroundDetector.add(boxCollider(1.2, 0.2, 'red', true));

const scoreDisplay = new Entity();
scoreDisplay.add(new Transform(new Vector2(0.2)));
const scoreText = new Text();
scoreText.getText = () => `Score: ${Math.round(player.get('score').score)}`;
scoreDisplay.add(scoreText);

const spawnOffsets = new Vector2(0, -20);
const bomber = new Entity();
bomber.add(new FollowTransform(player, { lockX: true, offset: spawnOffsets }));
bomber.add(new Spawn(makeBomb));
bomber.add(boxCollider(getWidth(), 1, 'red', true));
bomber.add(new Transform(new Vector2(getWidth() / 2, 0)));

const powerupper = new Entity();
powerupper.add(new FollowTransform(player, { lockX: true, offset: spawnOffsets }));
const powerupSpawn = new Spawn(makePowerup);
powerupSpawn.spawnRate = 1/30;
powerupper.add(powerupSpawn);
powerupper.add(boxCollider(getWidth(), 1, 'red', true));
powerupper.add(new Transform(new Vector2(getWidth() / 2, 0)));

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
engine.addEntity(powerupper);

engine.addEntity(groundTiler);
engine.addEntity(leftWallTiler);
engine.addEntity(rightWallTiler);

engine.addEntity(makePowerup());

engine.addEntity(camera);

engine.addEntity(scoreDisplay);

addRenderer(engine);

addFollows(engine);
addExplosionManager(engine);
addSpawn(engine);
drawCollider(engine);
particleManager(engine);
addGravity(engine);
addPlayerController(engine);
addPhysics(engine);
deformTerrain(engine);
removeDeadThings(engine);
addRemoveAfterTime(engine);
addGroundTiler(engine);
addContactTracker(engine);
addScoreTracker(engine);
addVelocityClamp(engine);
powerups(engine, makeGrenade, makeLaser);
animator(engine);

