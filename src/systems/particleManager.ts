import { Particle } from "../particles/particle";
import { particlePool } from "../particles/particlePool";
import { Engine } from "../engine";
import Vector2 from "../core/vector2";
import { context } from "../game";
import ParticleEmitter from "../components/particleEmitter";
import { Transform } from "../components/transform";
import { PIXELS_A_METRE, getCamera } from "./addRenderer";

export const liveParticles: Particle[] = [];

export default (engine: Engine) => {

    const updateParticle = (particle: Particle, step: number) => {
        const forces = (particle.emitter ? particle.emitter.forces : [])
            .reduce((prev, next) => prev.add(next), Vector2.zero);

        const acceleration = forces.mul(particle.mass);

        particle.velocityX += acceleration.x * step;
        particle.velocityY += acceleration.y * step;

        particle.positionX += particle.velocityX * step;
        particle.positionY += particle.velocityY * step;

        particle.rotation += particle.angularVelocity;

        particle.timeToLive -= step;
    }

    // Particle updating.
    engine.makeSystem().onMessage('tick', ({ step }) => {
        const toRemove = [];
        for (let i = 0; i < liveParticles.length; ++i) {
            const particle = liveParticles[i];
            updateParticle(particle, step);

            if (particle._initialLife === undefined)
                particle._initialLife = particle.timeToLive;

            if (particle.timeToLive <= 0)
                toRemove.push(i);

            for (const modifier of particle.emitter.modifiers || [])
                modifier(particle);
        }

        // Destroy all the dead particles.
        for (let i = toRemove.length - 1; i >= 0; --i) {
            const index = toRemove[i];
            liveParticles[index].emitter.emittedParticles--;
            particlePool.release(liveParticles[index]);
            liveParticles.splice(index, 1);
        }
    });

    // Particle rendering.
    engine.makeSystem().onMessage('tick', () => {
        context.save();
        context.scale(PIXELS_A_METRE, PIXELS_A_METRE);

        for (const particle of liveParticles) {
            context.save();
            context.translate(particle.positionX, particle.positionY);
            context.rotate(particle.rotation);
            context.scale(particle.scaleX, particle.scaleY);

            context.globalAlpha = particle.alpha;
            context.fillStyle = particle.color;

            switch(particle.emitter.shape) {
                case 'square':
                    context.translate(-0.5, -0.5);
                    context.fillRect(0, 0, 1, 1);
                    break;
                case "circle":
                    context.beginPath();
                    context.arc(0, 0, 0.5, 0, Math.PI*2);
                    context.fill();
                    break;
            }
            
            context.restore();
        }

        context.restore();
    });

    const emitParticle = (emitter: ParticleEmitter, transform: Transform) => {
        const particle = particlePool.get();
        particle.emitter = emitter;

        particle.timeToLive = emitter.startLife.getNextValue();

        const positionModifier = emitter.emitPositionModifier.getNextValue();
        particle.positionX = transform.position.x + positionModifier.x;
        particle.positionY = transform.position.y + positionModifier.y;

        particle.rotation = transform.rotation + emitter.startRotation.getNextValue();
        particle.scaleX = particle.scaleY = emitter.startSize.getNextValue();

        particle.angularVelocity = emitter.startAngularVelocity.getNextValue();
        const velocity = emitter.startVelocity.getNextValue();
        particle.velocityX = velocity.x;
        particle.velocityY = velocity.y;

        particle.color = emitter.color.getNextValue();

        liveParticles.push(particle);
        emitter.emittedParticles++;
    }

    engine.makeSystem('particleEmitter', 'transform')
        .onEach('tick', ({ id, particleEmitter, transform }, message) => {
            if (particleEmitter.startDelay >= 0) {
                particleEmitter.startDelay -= message.step;
                return;
            }

            // Make sure we have the minimum number of particles.
            while (particleEmitter.emittedParticles < particleEmitter.numParticles.min) {
                emitParticle(particleEmitter, transform);
            }

            particleEmitter.nextEmitParticles = 0;

            particleEmitter.duration -= message.step;
            if (particleEmitter.duration <= 0) {
                engine.removeEntity(id);
            }
        });
};