import { Particle } from "./particle";
import ParticleEmitter from "../components/particleEmitter";

export type ParticleModifier = (particle: Particle) => void;

export const alphaModifier: ParticleModifier = (particle: Particle) => {
    particle.alpha = particle.timeToLive/particle._initialLife;
}