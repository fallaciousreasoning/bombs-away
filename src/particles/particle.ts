import Vector2 from "../core/vector2";
import ParticleEmitter from "../components/particleEmitter";

export interface Particle {
    emitter: ParticleEmitter;

    mass: number;

    velocityX: number;
    velocityY: number;
    angularVelocity: number;

    positionX: number;
    positionY: number;
    rotation: number;
    scaleX: number;
    scaleY: number;

    timeToLive: number;

    color: string;
}