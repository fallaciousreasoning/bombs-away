import { bombCollider, boxCollider, circleCollider, fromVertices, triangleCollider } from "./collision/colliderFactory";
import AliveForTime from "./components/aliveForTime";
import AnimateSize from "./components/animateSize";
import Body from "./components/body";
import Box from "./components/box";
import { Camera } from "./components/camera";
import { CollisionTexture } from "./components/collisionTexture";
import ContactTracker from "./components/contactTracker";
import Explodes from "./components/explodes";
import { FollowTransform } from "./components/followTransform";
import GroundTiler from "./components/groundTiler";
import Player from "./components/player";
import Powerup from "./components/powerup";
import Powerupable from "./components/powerupable";
import RemoveWhenFar from "./components/removeWhenFar";
import { Replaceable } from "./components/replaceable";
import Score from "./components/score";
import Spawn from "./components/spawn";
import { Tag } from "./components/tag";
import { Text } from './components/text';
import { Transform } from "./components/transform";
import { Color } from "./core/color";
import Vector2 from "./core/vector2";
import { Entity } from "./entity";
import { canvas, engine } from './game';
import { polygonsToString } from "./geometry/serializer";
import { explosionEmitter } from "./particles/emitterFactory";
import addContactTracker from "./systems/addContactTracker";
import addExplosionManager from "./systems/addExplosionManager";
import addFollows from "./systems/addFollows";
import addGravity from "./systems/addGravity";
import addGroundTiler from "./systems/addGroundTiler";
import addRemoveAfterTime from "./systems/addRemoveAfterTime";
import addRenderer, { getWidth, METRES_A_PIXEL } from './systems/addRenderer';
import addScoreTracker from "./systems/addScoreTracker";
import addVelocityClamp from "./systems/addVelocityClamp";
import animator from "./systems/animator";
import drawCollider from "./systems/colliderRenderer";
import addPhysics from "./systems/collisionDetector";
import { getVerticesFromTexture } from "./systems/collisionTextureManager";
import { addFixtureManager } from "./systems/fixtureManager";
import particleManager from "./systems/particleManager";
import addPlayerController from "./systems/playerController";
import powerups, { powers, powerupColors } from "./systems/powerups";
import removeDeadThings from "./systems/removeDeadThings";
import replaceOnDeath from "./systems/replaceOnDeath";
import addSpawn from "./systems/spawnSystem";
import { Entityish } from "./systems/system";
import { random, randomValue } from "./utils/random";
import { ColliderRenderer } from "./components/colliderRenderer";
import "./hud";
import Health from "./components/health";

window['engine'] = engine;
window['debugPoints'] = [];
window['polyString'] = polygonsToString;

addFixtureManager(engine);

const makeExplosion = (radius: number) => new Entity()
    .add(new Transform)
    .add(explosionEmitter(radius / 2));

const makeBomb = () => {
    const size = random(0.4, 1);
    const radius = 4 * size;
    const force = 50 * size;

    return new Entity()
        .add(() => {
            const explodes = new Explodes();
            explodes.shape = { type: 'circle', radius };
            explodes.force = force;
            return explodes;
        })
        .add(new Transform())
        .add(bombCollider(size, size * 1.5))
        .add(new ColliderRenderer())
        .add(new AliveForTime(5, Color.black, Color.white))
        .add(new Replaceable(() => makeExplosion(radius)))
        .add(new Body());
}

const makePowerup = () => {
    const power = randomValue(powers);
    return new Entity()
        .add(new Transform(new Vector2(2, -4)))
        .add(new Body())
        .add(new Powerup(power))
        .add(() => {
            const aliveForTime = new AliveForTime(30);
            aliveForTime.aliveColor = powerupColors[power];
            aliveForTime.deadColor = new Color(aliveForTime.aliveColor.r, aliveForTime.aliveColor.g, aliveForTime.aliveColor.b, 0);
            return aliveForTime;
        })
        .add(triangleCollider(1))
        .add(new ColliderRenderer(powerupColors[power]));
}

const makeGrenade = () => {
    const size = 5;
    return new Entity()
        .add(new Transform)
        .add(() => {
            const explodes = new Explodes();
            explodes.shape = { type: 'circle', radius: size };
            explodes.force = 100;
            return explodes;
        })
        .add(new Replaceable(() => makeExplosion(size)))
        // Grenades explode immediately.
        .add(new AliveForTime(0));
}

const makeLaser = () => {
    const width = getWidth() * 2;
    const height = 4;
    const duration = 1;

    return new Entity()
        .add(new Transform)
        .add(new Box(width, height, '#ff9900'))
        .add(() => {
            const explodes = new Explodes();
            explodes.force = 0;
            explodes.shape = { type: 'box', width, height };
            return explodes;
        })
        .add(new AliveForTime(duration))
        .add(new AnimateSize(new Vector2(1, 0.1), Vector2.one, duration));
}

export const newGame = (noPlayer?: boolean) => {
    engine.clearEntities();

    const distanceConsideredFar = 50;
    const makeGroundTile = () => {
        const width = 5;
        const height = 5;
        const gridSize = 0.5;

        return new Entity()
            .add(new Tag('terrain'))
            .add(new Transform())
            .add(new CollisionTexture(width, height, gridSize))
            .add(new RemoveWhenFar(distanceConsideredFar, player, Vector2.up))
            .add(e => fromVertices(...getVerticesFromTexture(e.collisionTexture)))
            .add(new ColliderRenderer('green', 'green'));
    }

    const makeWall = (side: 'left' | 'right') => {
        const height = 50;
        const width = 1;
        return new Entity()
            .add(new Tag('wall'))
            .add(new Transform(new Vector2(side === 'left'
                ? -0.5
                : getWidth() + 0.5, 0)))
            .add(new FollowTransform(player, { lockX: true }))
            .add(() => {
                const collider = boxCollider(width, height);
                collider.friction = 0;
                return collider;
            });
    }
    const player = new Entity()
        .add(new Tag('player'))
        .add(new Transform(new Vector2(5, -1)))
        // Player is only ever dead or alive.
        .add(new Health(1))
        .add(e => {
            const player = new Player();
            // The player can jump if the ground tracker isn't touching the player.
            player.groundTracker = new ContactTracker('player', true);
            return player;
        })
        .add(() => {
            const collider = circleCollider(1, 20);
            collider.friction = 0.1;
            collider.elasticity = 0;
            return collider;
        })
        .add(new Body(3))
        .add(new Score('#score', '#highscore'))
        .add(new Powerupable())
        .add(new ColliderRenderer());

    const playerGroundDetector = new Entity()
        .add(new Transform(new Vector2(0, 1), 0, player.transform))
        .add(player.player.groundTracker)
        .add(boxCollider(1.2, 0.2, true));

    const spawnOffsets = new Vector2(0, -20);
    const bomber = new Entity()
        .add(new Transform(new Vector2(getWidth() / 2, 0)))
        .add(new FollowTransform(player, { lockX: true, offset: spawnOffsets }))
        .add(new Spawn(makeBomb))
        .add(boxCollider(getWidth(), 1, true));

    const powerupper = new Entity()
        .add(new FollowTransform(player, { lockX: true, offset: spawnOffsets }))
        .add(() => {
            const spawn = new Spawn(makePowerup);
            spawn.spawnRate = 1 / 30;
            return spawn;
        })
        .add(boxCollider(getWidth(), 1, true))
        .add(new Transform(new Vector2(getWidth() / 2, 0)));

    const groundTiler = new Entity()
        .add(new Transform(new Vector2(2.5, 3)))
        .add(new GroundTiler(player,
            makeGroundTile,
            (tileWidth) => getWidth() / tileWidth));

    const camera = new Entity()
        .add(new Transform(new Vector2(canvas.width * METRES_A_PIXEL / 2, 0)))
        .add(new FollowTransform(player, { lockX: true, spring: 10 }))
        .add(new Camera());

    if (!noPlayer)
        engine.addEntity(player);
    engine.addEntity(playerGroundDetector);
    engine.addEntity(makeWall('left'));
    engine.addEntity(makeWall('right'));

    engine.addEntity(bomber);
    engine.addEntity(powerupper);

    engine.addEntity(groundTiler);

    engine.addEntity(camera);
}

// Don't add a player, so we get a call backdrop
// to the menu on first load.
newGame(/** noPlayer = */true);

addRenderer(engine, Color.black);
addFollows(engine);
addExplosionManager(engine);
addSpawn(engine);
drawCollider(engine);
particleManager(engine);
addGravity(engine);
addPlayerController(engine);
addPhysics(engine);
removeDeadThings(engine);
addRemoveAfterTime(engine);
addGroundTiler(engine);
addContactTracker(engine);
addScoreTracker(engine);
addVelocityClamp(engine);
powerups(engine, makeGrenade, makeLaser);
animator(engine);
replaceOnDeath(engine);

