import { Pool } from "../core/pool";
import { Particle } from "./particle";
import Vector2 from "../core/vector2";

export const particlePool = new Pool<Particle>(() => ({
    emitter: undefined,

    mass: 1,

    angularVelocity: 0,
    velocityX: 0,
    velocityY: 0,

    positionX: 0,
    positionY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,

    color: 'back',
    timeToLive: 0,
    _initialLife: undefined,

    alpha: 0,
}), p => {
    p.emitter = undefined
    p._initialLife = undefined;
    p.alpha = 0;
});