import { boxCollider, circleCollider, fromVertices } from "./collision/colliderFactory";
import Body from "./components/body";
import Explodes from "./components/explodes";
import Health from "./components/health";
import Player from "./components/player";
import Spawn from "./components/spawn";
import { Tag } from "./components/tag";
import { Transform } from "./components/transform";
import Input from "./core/input";
import Vector2 from "./core/vector2";
import { Entity } from "./entity";
import { engine, canvas } from './game';
import { polygonsToString } from "./geometry/serializer";
import { Vertices } from "./geometry/vertices";
import explode from "./systems/addExplosion";
import addGravity from "./systems/addGravity";
import addRenderer, { METRES_A_PIXEL } from './systems/addRenderer';
import drawCollider from "./systems/colliderRenderer";
import addPhysics from "./systems/collisionDetector";
import convexHullTester from "./systems/convexHullTester";
import { deformTerrain } from "./systems/deformTerrain";
import addPlayerController from "./systems/playerController";
import removeDeadThings from "./systems/removeDeadThings";
import addSpawn from "./systems/spawnSystem";
import { Fixture } from "./collision/fixture";
import { addFixtureManager } from "./systems/fixtureManager";
import { addCollisionTextureManager } from './systems/collisionTextureManager'
import { StayOnMouse } from "./components/stayOnMouse";
import { Circle } from "./components/circle";
import Box from "./components/box";
import { CollisionTexture } from "./components/collisionTexture";
import GroundTiler from "./components/groundTiler";
import addGroundTiler from "./systems/addGroundTiler";
import { Entityish } from "./systems/system";
import { FollowTransform } from "./components/followTransform";
import { Camera } from "./components/camera";
import addFollows from "./systems/addFollows";

window['engine'] = engine;
window['debugPoints'] = [];
window['polyString'] = polygonsToString;

addFixtureManager(engine);

const makeExplosion = (from: Entity) => {
    const explosion = new Entity();

    explosion.add(new Tag('deforms'));
    explosion.add(new Transform(from.get('transform').position));
    explosion.add(circleCollider(1));
    explosion.get('collider').isTrigger = true;
    explosion.add(new Health(1));

    return explosion;
}

const makeBomb = (spawn: Entity) => {
    const bomb = new Entity();

    bomb.add(new Explodes(makeExplosion));
    bomb.add(new Transform(spawn.get('transform').position));
    bomb.add(boxCollider(1, 1));

    const body = new Body();
    bomb.add(body);

    return bomb;
}

const makeGroundTile = () => {
    const gridSize = 0.333333
    const ground = new Entity();
    ground.add(new Tag('terrain'));
    ground.add(boxCollider(5, 5));
    ground.add(new Transform());

    ground.add(new CollisionTexture(5, 5, gridSize));
    return ground;
}

const bomber = new Entity();
bomber.add(new Spawn(makeBomb));
bomber.add(new Transform(new Vector2(10, 0)));

const player = new Entity();
player.add(new Player());
player.add(circleCollider(1, 9));
player.add(new Transform(new Vector2(5, 3)));
player.add(new Body(3));

const block = new Entity();
block.add(boxCollider(1, 1));
block.add(new Transform(new Vector2(7, 3), Math.PI / 2));
block.add(new Body(10));

const ramp = new Entity();
ramp.add(fromVertices(new Vertices([
    new Vector2(-1, 0),
    new Vector2(-1, -1),
    new Vector2(1, 0)
])));
ramp.add(new Transform(new Vector2(2, 4.5)));

const dangerousCursor = new Entity();
dangerousCursor.add(new Transform());
dangerousCursor.add(new StayOnMouse());
dangerousCursor.add(new Tag('destroy-when-e'));
dangerousCursor.add(new Circle(0.5));

const groundTiler = new Entity();
groundTiler.add(new Transform(new Vector2(2.5, 10)));
groundTiler.add(new GroundTiler(player));

const camera = new Entity();
camera.add(new Transform(new Vector2(canvas.width*METRES_A_PIXEL/2, 0)));
camera.add(new FollowTransform(player, true));
camera.add(new Camera());

engine.addEntity(dangerousCursor);
engine.addEntity(ramp);
engine.addEntity(block);
// engine.addEntity(makeBomb(bomber));
engine.addEntity(player);
engine.addEntity(bomber);
engine.addEntity(groundTiler);
engine.addEntity(camera);

addRenderer(engine);

addCollisionTextureManager(engine, dangerousCursor as any);
addFollows(engine);
addSpawn(engine);
drawCollider(engine);
addGravity(engine);
addPlayerController(engine);
addPhysics(engine);
convexHullTester(engine);
deformTerrain(engine);
removeDeadThings(engine);
explode(engine);
addGroundTiler(engine, makeGroundTile as any);

