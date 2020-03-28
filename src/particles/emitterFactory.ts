import ParticleEmitter from "../components/particleEmitter"
import { GeneralConstraint, RandomVector2Generator, RandomColorGenerator } from "./particleConstraint";
import Vector2 from "../core/vector2";
import { alphaModifier } from "./particleModifier";
import { Color } from "../core/color";

interface BasicEmitterOptions {
    speed: number;
    startDelay: number;
    hasGravity: boolean;
    color: string;
    radius: number;
    shape: 'square' | 'circle'
}

const defaultOptions: BasicEmitterOptions = {
    speed: 1,
    startDelay: 0,
    hasGravity: true,
    color: 'red',
    shape: 'square',
    radius: 0,
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

    emitter.emitPositionModifier = RandomVector2Generator.fromRadius(options.radius);

    emitter.color = new RandomColorGenerator(new Color(0, 255, 0));
    emitter.shape = options.shape;

    emitter.modifiers = [
        alphaModifier
    ]
    return emitter;
}

export const explosionEmitter = (radius: number) => {
    const emitter = new ParticleEmitter();
    emitter.duration = 0;

    emitter.startLife = new GeneralConstraint(0.2);

    emitter.startAngularVelocity = new GeneralConstraint(-0.1, 0.1)
    emitter.startVelocity = RandomVector2Generator.fromRadius(radius*3);

    emitter.startRotation = new GeneralConstraint(0);
    emitter.startSize = new GeneralConstraint(0.2, 1);

    emitter.numParticles = new GeneralConstraint(100);

    emitter.emitPositionModifier = RandomVector2Generator.fromRadius(radius/2);

    emitter.color = new RandomColorGenerator(new Color(255, 0, 0), new Color(255, 165, 0));
    emitter.shape = 'square';

    emitter.modifiers = [
        alphaModifier
    ]
    return emitter;
}