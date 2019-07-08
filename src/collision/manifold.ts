import Vector2 from '../core/vector2';
import { Entity } from '../entity';
import { Vertices } from '../geometry/vertices';
import { Transform } from '../components/transform';
import { Fixture } from './fixture';
import { stableHashPair } from '../core/hashHelper';

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
    contacts: Vector2[] = [];

    private a: Fixture;
    private b: Fixture;

    constructor(a: Fixture, b: Fixture) {
        this.a = a;
        this.b = b;

        const aVertices = a.transformedVertices;
        const bVertices = b.transformedVertices;

        const ab = this.compute(aVertices, bVertices, 1);
        const ba = this.compute(bVertices, aVertices, -1);

        if (!(ab && ba)) {
            this.penetration = 0;
            this.normal = Vector2.zero;
        }
    }

    private compute(a: Vertices, b: Vertices, mul: 1 | -1) {
        const aimAt = a.centroid.sub(b.centroid); // TODO use transform.position instead?

        for (let i = 0; i < a.length; ++i) {
            const normal = a.normals[i];

            // No point worrying about normals pointing away from the other shape.
            if (aimAt.dot(normal) > 0) continue;

            const aMinMax = getMinMax(normal, a);
            const bMinMax = getMinMax(normal, b);

            const collides = !(bMinMax.min > aMinMax.max || aMinMax.min > bMinMax.max);
            if (!collides) return false;

            const penetration = Math.min(aMinMax.max, bMinMax.max) - Math.max(aMinMax.min, bMinMax.min);
            if (penetration < this.penetration || !this.penetration) {
                this.penetration = penetration;
                this.normal = normal.mul(mul);
                const supportPoints = b.getSupports(normal.negate());

                // If we only have one support point, that's our contact.
                if (supportPoints.length <= 1) {
                    this.contacts = supportPoints;
                    continue;
                }

                // The two faces must be parallel, so we have
                // four potential contact points.
                supportPoints.push(...a.getSupports(normal));

                // Sort the points by where they are on the tangent.
                const tangent = new Vector2(-normal.y, normal.x);
                supportPoints.sort((a, b) => a.dot(tangent) - b.dot(tangent));

                // We want the middle two contact points.
                this.contacts = [supportPoints[1], supportPoints[2]];
            }
        }

        // If we reached here, we must have a collision.
        return true;
    }

    static hashCodeOf(a: Fixture, b: Fixture) {
        return stableHashPair(a.id, b.id);
    }
}