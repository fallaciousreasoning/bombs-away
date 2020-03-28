import Vector2 from "../core/vector2";
import { Particle } from "../particles/particle";
import { GeneralConstraint, RandomVector2Generator } from "../particles/particleConstraint";

export default class ParticleEmitter {
    type: 'particleEmitter' = 'particleEmitter';
    
    startDelay: number;
    duration: number;

    forces: Vector2[] = [];
    
    private _totalForce: Vector2;
    get totalForce() {
        if (!this._totalForce)
            this._totalForce = this.forces.reduce((prev, next) => prev.add(next), Vector2.zero);
        return this._totalForce;
    }

    startLife: GeneralConstraint;
    
    startAngularVelocity: GeneralConstraint;
    startVelocity: RandomVector2Generator;
    
    startRotation: GeneralConstraint;
    startSize: GeneralConstraint;
    
    numParticles: GeneralConstraint;
    emittedParticles: number = 0;
    nextEmitParticles: number = 100;

    emitPositionModifier: RandomVector2Generator;
    
    color: string;
    shape: 'square' | 'circle';
}