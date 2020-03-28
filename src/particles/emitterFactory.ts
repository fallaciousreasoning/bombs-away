import ParticleEmitter from "../components/particleEmitter"
import { GeneralConstraint, RandomVector2Generator } from "./particleConstraint";
import Vector2 from "../core/vector2";

interface BasicEmitterOptions {
    speed: number;
    startDelay: number;
    hasGravity: boolean;
    color: string;
}

const defaultOptions: BasicEmitterOptions = {
    speed: 3,
    startDelay: 0,
    hasGravity: true,
    color: 'red',
};

export const basicEmitter = (options?: Partial<BasicEmitterOptions>) => {
    options = { ...defaultOptions, ...options };

    const emitter = new ParticleEmitter();
    emitter.duration = 0;
    emitter.startDelay = options.startDelay;

    emitter.forces = options.hasGravity ? [new Vector2(0, 9.8)] : [];

    emitter.startLife = new GeneralConstraint(1, 3);

    emitter.startAngularVelocity = new GeneralConstraint(-0.1, 0.1)
    emitter.startVelocity = RandomVector2Generator.fromRadius(options.speed);

    emitter.startRotation = new GeneralConstraint(0);
    emitter.startSize = new GeneralConstraint(0.2, 1);

    emitter.numParticles = new GeneralConstraint(100);

    emitter.color = options.color;
    return emitter;
}