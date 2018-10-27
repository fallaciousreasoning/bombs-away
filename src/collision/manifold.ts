import Vector2 from '../core/vector2';
import { Entity } from '../entity';
import { Vertices } from '../geometry/vertices';
import { Transform } from '../components/transform';

const getMinMax = (dir: Vector2, of: Vertices) => {
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;

    for (let vertex of of.vertices) {
        const projection = dir.dot(vertex);
        if (projection < min) min = projection;
        if (projection > max) max = projection;
    }

    return { min, max };
}

export class Manifold {
    penetration: number;
    normal: Vector2;
    

    constructor(a: Vertices, b: Vertices) {
        if (!(this.compute(a, b, 1) || this.compute(a, b, -1))) {
            this.penetration = 0;
            this.normal = Vector2.zero;
        }
    }

    private compute(a: Vertices, b: Vertices, mul: 1 | -1) {
        const aimAt = new Vector2(); // TODO vec from a to b

        for (let i = 0; i < a.length; ++i) {
            const normal = a.normals[i];

            // TODO: No point worrying about normals pointing away from the other shape.
            // if (aimAt.dot(normal) > 0) continue;
            
            const aMinMax = getMinMax(normal, a);
            const bMinMax = getMinMax(normal, b);

            const collides = !(bMinMax.min > aMinMax.max || aMinMax.min > bMinMax.max);
            if (!collides) return false;

            const penetration = Math.min(aMinMax.max, bMinMax.max) - Math.max(aMinMax.min, bMinMax.min);
            if (penetration < this.penetration) {
                this.penetration = penetration;
                this.normal = normal.mul(mul);
            }
        }

        // If we reached here, we must have a collision.
        return true;
    }
}