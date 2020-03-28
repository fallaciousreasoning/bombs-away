import ParticleEmitter from "../components/particleEmitter"
import { GeneralConstraint } from "./particleConstraint";
import Vector2 from "../core/vector2";

interface BasicEmitterOptions {
    speed: number;
    startDelay: number;
    hasGravity: boolean;
    color: string;
}

const defaultOptions: BasicEmitterOptions = {
    speed: 5,
    startDelay: 0,
    hasGravity: false,
    color: 'red',
};

export const basicEmitter = (options?: Partial<BasicEmitterOptions>) => {
    options = { ...defaultOptions, ...options };

    const emitter = new ParticleEmitter();
    emitter.duration = 10000;
    emitter.startDelay = options.startDelay;

    emitter.forces = options.hasGravity ? [new Vector2(0, 9.8)] : [];

    emitter.startLife = new GeneralConstraint(1, 3);

    emitter.startAngularVelocity = new GeneralConstraint(0)
    emitter.startVelocityX = new GeneralConstraint(-options.speed, options.speed);
    emitter.startVelocityY = new GeneralConstraint(-options.speed, options.speed);

    emitter.startRotation = new GeneralConstraint(0, Math.PI * 2);
    emitter.startSize = new GeneralConstraint(0.1, 1);

    emitter.numParticles = new GeneralConstraint(100);
    
    emitter.color = options.color;
    return emitter;
}