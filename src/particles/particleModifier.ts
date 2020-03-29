import { Particle } from "./particle";
import ParticleEmitter from "../components/particleEmitter";

export type ParticleModifier = (particle: Particle) => void;

export const alphaModifier: ParticleModifier = (particle: Particle) => {
    if (particle.timeToLive <= 0) {
        particle.alpha = 0;
        return;
    }
    particle.alpha = particle.timeToLive / particle._initialLife;
}

export const velocityDamper: (amount: number) => ParticleModifier = (amount) => (particle) => {
    particle.velocityX *= amount;
    particle.velocityY *= amount;
    particle.angularVelocity *= amount;
}